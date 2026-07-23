import { createHmac, randomUUID } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import bcrypt from 'bcryptjs';
import { v2 as cloudinary } from 'cloudinary';
import cookieParser from 'cookie-parser';
import express from 'express';
import rateLimit from 'express-rate-limit';
import { cert, initializeApp } from 'firebase-admin/app';
import { getFirestore, FieldValue, Timestamp } from 'firebase-admin/firestore';
import helmet from 'helmet';
import { z } from 'zod';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.resolve(__dirname, '..', 'dist');

const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

if (serviceAccount.projectId && serviceAccount.clientEmail && serviceAccount.privateKey) {
  initializeApp({ credential: cert(serviceAccount) });
} else {
  initializeApp();
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const db = getFirestore();
const app = express();

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const SESSION_COOKIE = 'aventro_admin_session';
const SESSION_DURATION_MS = 8 * 60 * 60 * 1000;
const IMAGE_TYPES = new Map([
  ['image/jpeg', 'jpg'],
  ['image/png', 'png'],
  ['image/webp', 'webp'],
]);

const optionalText = (max) => z.string().trim().max(max).default('');
const optionalUrl = z.union([z.literal(''), z.url().max(2000)]).default('');
const commonFields = {
  published: z.boolean(),
  displayOrder: z.coerce.number().int().min(0).max(100000),
};
const projectSchema = z.object({
  title: z.string().trim().min(2).max(160),
  shortDescription: z.string().trim().min(10).max(500),
  fullDescription: z.string().trim().min(10).max(5000),
  status: z.enum(['future', 'ongoing', 'completed']),
  clientName: optionalText(160),
  location: optionalText(160),
  startDate: optionalText(40),
  completionDate: optionalText(40),
  mainImageUrl: optionalUrl,
  mainImagePath: optionalText(500),
  additionalImageUrls: z.array(z.url().max(2000)).max(12).default([]),
  additionalImagePaths: z.array(z.string().trim().max(500)).max(12).default([]),
  ...commonFields,
}).strict();
const reviewSchema = z.object({
  customerName: z.string().trim().min(2).max(120),
  companyName: optionalText(160),
  reviewText: z.string().trim().min(10).max(2000),
  rating: z.coerce.number().int().min(1).max(5),
  customerImageUrl: optionalUrl,
  customerImagePath: optionalText(500),
  ...commonFields,
}).strict();
const companyLogoSchema = z.object({
  companyName: z.string().trim().min(2).max(160),
  logoUrl: z.url().max(2000),
  logoPath: optionalText(500),
  websiteUrl: optionalUrl,
  ...commonFields,
}).strict();
const enquirySchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.email().max(254),
  phone: optionalText(30),
  type: optionalText(80),
  message: z.string().trim().min(10).max(3000),
}).strict();
const loginSchema = z.object({
  username: z.string().trim().min(1).max(120),
  password: z.string().min(1).max(200),
}).strict();
const contentTypes = {
  projects: { collection: 'projects', schema: projectSchema, imageFields: ['mainImagePath', 'additionalImagePaths'] },
  reviews: { collection: 'reviews', schema: reviewSchema, imageFields: ['customerImagePath'] },
  'company-logos': { collection: 'companyLogos', schema: companyLogoSchema, imageFields: ['logoPath'] },
};

const enquiryLimiter = rateLimit({ windowMs: 60 * 60 * 1000, limit: 10, standardHeaders: true, legacyHeaders: false, message: { error: 'Too many enquiries. Try again later.' } });
const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 5, standardHeaders: true, legacyHeaders: false, message: { error: 'Too many login attempts. Try again later.' } });

app.disable('x-powered-by');
app.set('trust proxy', 1);
app.use(helmet());
app.use(cookieParser());

function envValue(name) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not configured.`);
  return value;
}

function requestOriginMatches(req) {
  const origin = req.get('origin');
  if (!origin) return false;
  try {
    const expectedHost = (req.get('x-forwarded-host') || req.get('host') || '').split(',')[0].trim();
    return new URL(origin).host === expectedHost;
  } catch {
    return false;
  }
}

function requireSameOrigin(req, res, next) {
  if (!requestOriginMatches(req)) return res.status(403).json({ error: 'Request origin is not allowed.' });
  return next();
}

function sessionDocumentId(token) {
  return createHmac('sha256', envValue('ADMIN_SESSION_SECRET')).update(token).digest('hex');
}

function sessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    sameSite: 'strict',
    path: '/',
    maxAge: SESSION_DURATION_MS,
  };
}

function clearSessionCookie(res) {
  const { maxAge, ...options } = sessionCookieOptions();
  res.clearCookie(SESSION_COOKIE, options);
}

async function readSession(req) {
  const token = req.cookies?.[SESSION_COOKIE];
  if (!token || token.length > 200) return null;
  const ref = db.collection('adminSessions').doc(sessionDocumentId(token));
  const snapshot = await ref.get();
  if (!snapshot.exists) return null;
  const session = snapshot.data();
  const expiresAt = session?.expiresAt instanceof Timestamp ? session.expiresAt.toMillis() : 0;
  if (expiresAt <= Date.now()) {
    await ref.delete().catch(() => {});
    return null;
  }
  return { ref, username: session.username };
}

async function requireAdmin(req, res, next) {
  try {
    const session = await readSession(req);
    if (!session) {
      clearSessionCookie(res);
      return res.status(401).json({ error: 'Administrator login is required.' });
    }
    req.admin = session;
    return next();
  } catch (error) {
    return next(error);
  }
}

function serialize(value) {
  if (value instanceof Timestamp) return value.toDate().toISOString();
  if (Array.isArray(value)) return value.map(serialize);
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, serialize(item)]));
  return value;
}

function parseBody(schema, req, res) {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: 'Invalid request data.', fields: z.flattenError(result.error).fieldErrors });
    return null;
  }
  return result.data;
}

async function writeAudit(action, collection, documentId) {
  await db.collection('adminAuditLogs').add({ action, collection, documentId, createdAt: FieldValue.serverTimestamp() });
}

function imagePaths(record, fields) {
  return fields.flatMap((field) => Array.isArray(record?.[field]) ? record[field] : record?.[field] ? [record[field]] : []).filter(Boolean);
}

function uploadToCloudinary(buffer, folder) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `aventro/${folder}`,
        resource_type: 'image',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(result);
      },
    );

    uploadStream.end(buffer);
  });
}

async function deleteImages(publicIds) {
  await Promise.all(publicIds.map((publicId) => cloudinary.uploader.destroy(publicId, { invalidate: true }).catch((error) => console.error('Cloudinary cleanup failed', error?.message))));
}

app.post('/api/admin/uploads', requireAdmin, requireSameOrigin, express.raw({ type: [...IMAGE_TYPES.keys()], limit: MAX_IMAGE_BYTES }), async (req, res) => {
  try {
    const contentType = req.get('content-type')?.split(';')[0];
    const extension = IMAGE_TYPES.get(contentType);
    const folder = String(req.query.folder || '');
    const entityId = String(req.query.entityId || '').replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 100);
    const buffer = Buffer.isBuffer(req.body) ? req.body : req.rawBody;
    if (!extension || !['projects', 'reviews', 'company-logos'].includes(folder) || !entityId || !Buffer.isBuffer(buffer) || buffer.length === 0 || buffer.length > MAX_IMAGE_BYTES) {
      return res.status(400).json({ error: 'Invalid image upload.' });
    }
    const result = await uploadToCloudinary(buffer, folder);
    return res.status(201).json({ url: result.secure_url, path: result.public_id });
  } catch (error) {
    console.error('Image upload failed', error?.message);
    return res.status(500).json({ error: 'Unable to upload the image.' });
  }
});

app.use(express.json({ limit: '256kb', strict: true }));

app.post('/api/admin/login', loginLimiter, requireSameOrigin, async (req, res, next) => {
  const input = parseBody(loginSchema, req, res);
  if (!input) return;
  try {
    const username = envValue('ADMIN_USERNAME');
    const usernameMatches = input.username === username;
    const passwordMatches = await bcrypt.compare(input.password, envValue('ADMIN_PASSWORD_HASH'));
    if (!usernameMatches || !passwordMatches) return res.status(401).json({ error: 'Invalid username or password.' });

    const token = `${randomUUID()}${randomUUID()}`;
    const expiresAt = Date.now() + SESSION_DURATION_MS;
    await db.collection('adminSessions').doc(sessionDocumentId(token)).set({
      username,
      createdAt: FieldValue.serverTimestamp(),
      expiresAt: Timestamp.fromMillis(expiresAt),
    });
    res.cookie(SESSION_COOKIE, token, sessionCookieOptions());
    return res.json({ username, expiresAt: new Date(expiresAt).toISOString() });
  } catch (error) {
    return next(error);
  }
});

app.get('/api/admin/session', requireAdmin, (req, res) => res.json({ username: req.admin.username }));

app.post('/api/admin/logout', requireSameOrigin, async (req, res, next) => {
  try {
    const session = await readSession(req);
    if (session) await session.ref.delete();
    clearSessionCookie(res);
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
});

app.post('/api/enquiries', enquiryLimiter, requireSameOrigin, async (req, res) => {
  const input = parseBody(enquirySchema, req, res);
  if (!input) return;
  try {
    await db.collection('enquiries').add({ ...input, status: 'new', createdAt: FieldValue.serverTimestamp() });
    return res.status(201).json({ success: true });
  } catch (error) {
    console.error('Enquiry creation failed', error?.message);
    return res.status(500).json({ error: 'Unable to send the enquiry.' });
  }
});

for (const [routeName, config] of Object.entries(contentTypes)) {
  const route = `/api/admin/${routeName}`;
  app.get(route, requireAdmin, async (_req, res) => {
    try {
      const snapshot = await db.collection(config.collection).orderBy('displayOrder', 'asc').get();
      return res.json({ items: snapshot.docs.map((doc) => ({ id: doc.id, ...serialize(doc.data()) })) });
    } catch (error) {
      console.error(`List ${config.collection} failed`, error?.message);
      return res.status(500).json({ error: 'Unable to load content.' });
    }
  });

  app.post(route, requireAdmin, requireSameOrigin, async (req, res) => {
    const input = parseBody(config.schema, req, res);
    if (!input) return;
    try {
      const ref = db.collection(config.collection).doc();
      await ref.set({ ...input, createdAt: FieldValue.serverTimestamp(), updatedAt: FieldValue.serverTimestamp() });
      await writeAudit('create', config.collection, ref.id);
      const saved = await ref.get();
      return res.status(201).json({ item: { id: ref.id, ...serialize(saved.data()) } });
    } catch (error) {
      console.error(`Create ${config.collection} failed`, error?.message);
      return res.status(500).json({ error: 'Unable to create content.' });
    }
  });

  app.put(`${route}/:id`, requireAdmin, requireSameOrigin, async (req, res) => {
    const input = parseBody(config.schema, req, res);
    if (!input) return;
    try {
      const ref = db.collection(config.collection).doc(req.params.id);
      const existing = await ref.get();
      if (!existing.exists) return res.status(404).json({ error: 'Content was not found.' });
      await ref.update({ ...input, updatedAt: FieldValue.serverTimestamp() });
      const stalePaths = imagePaths(existing.data(), config.imageFields).filter((path) => !imagePaths(input, config.imageFields).includes(path));
      await deleteImages(stalePaths);
      await writeAudit('update', config.collection, ref.id);
      const saved = await ref.get();
      return res.json({ item: { id: ref.id, ...serialize(saved.data()) } });
    } catch (error) {
      console.error(`Update ${config.collection} failed`, error?.message);
      return res.status(500).json({ error: 'Unable to update content.' });
    }
  });

  app.delete(`${route}/:id`, requireAdmin, requireSameOrigin, async (req, res) => {
    try {
      const ref = db.collection(config.collection).doc(req.params.id);
      const existing = await ref.get();
      if (!existing.exists) return res.status(404).json({ error: 'Content was not found.' });
      await ref.delete();
      await deleteImages(imagePaths(existing.data(), config.imageFields));
      await writeAudit('delete', config.collection, ref.id);
      return res.status(204).send();
    } catch (error) {
      console.error(`Delete ${config.collection} failed`, error?.message);
      return res.status(500).json({ error: 'Unable to delete content.' });
    }
  });
}

app.use('/api', (_req, res) => res.status(404).json({ error: 'Endpoint not found.' }));
app.use(express.static(publicDir));
app.use((req, res, next) => {
  if (req.method !== 'GET') return next();
  return res.sendFile(path.join(publicDir, 'index.html'), (error) => {
    if (error) next();
  });
});
app.use((error, _req, res, _next) => {
  if (error?.type === 'entity.too.large') return res.status(413).json({ error: 'Request is too large.' });
  if (error instanceof SyntaxError) return res.status(400).json({ error: 'Invalid JSON request.' });
  console.error('Unhandled API error', error?.message);
  return res.status(500).json({ error: 'Unexpected server error.' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
