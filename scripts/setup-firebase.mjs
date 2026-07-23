import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

const root = process.cwd();
const envPath = path.join(root, '.env');
const firebasercPath = path.join(root, '.firebaserc');

const rl = readline.createInterface({ input, output });

function valueFromConfig(raw, key) {
  const quoted = new RegExp(`${key}\\s*:\\s*["']([^"']+)["']`).exec(raw);
  if (quoted) return quoted[1].trim();
  const envLine = new RegExp(`^\\s*${key}\\s*=\\s*(.+?)\\s*$`, 'im').exec(raw);
  return envLine ? envLine[1].trim().replace(/^["']|["']$/g, '') : '';
}

async function ask(label, fallback = '') {
  const suffix = fallback ? ` [${fallback}]` : '';
  const answer = (await rl.question(`${label}${suffix}: `)).trim();
  return answer || fallback;
}

function writeEnv(config) {
  const contents = [
    `VITE_FIREBASE_API_KEY=${config.apiKey}`,
    `VITE_FIREBASE_AUTH_DOMAIN=${config.authDomain}`,
    `VITE_FIREBASE_PROJECT_ID=${config.projectId}`,
    `VITE_FIREBASE_STORAGE_BUCKET=${config.storageBucket}`,
    `VITE_FIREBASE_MESSAGING_SENDER_ID=${config.messagingSenderId}`,
    `VITE_FIREBASE_APP_ID=${config.appId}`,
    config.measurementId ? `VITE_FIREBASE_MEASUREMENT_ID=${config.measurementId}` : '',
    '',
  ].filter((line, index, lines) => line || index === lines.length - 1).join('\n');
  fs.writeFileSync(envPath, contents, 'utf8');
}

function writeFirebaserc(projectId) {
  fs.writeFileSync(
    firebasercPath,
    JSON.stringify({ projects: { default: projectId } }, null, 2) + '\n',
    'utf8',
  );
}

try {
  console.log('Paste your Firebase web config object, then press Enter.');
  console.log('Example starts with: const firebaseConfig = { apiKey: ... }');
  const pasted = await rl.question('Firebase config (or leave blank to answer one by one): ');

  const config = {
    apiKey: valueFromConfig(pasted, 'apiKey'),
    authDomain: valueFromConfig(pasted, 'authDomain'),
    projectId: valueFromConfig(pasted, 'projectId'),
    storageBucket: valueFromConfig(pasted, 'storageBucket'),
    messagingSenderId: valueFromConfig(pasted, 'messagingSenderId'),
    appId: valueFromConfig(pasted, 'appId'),
    measurementId: valueFromConfig(pasted, 'measurementId'),
  };

  config.apiKey = await ask('apiKey', config.apiKey);
  config.authDomain = await ask('authDomain', config.authDomain);
  config.projectId = await ask('projectId', config.projectId);
  config.storageBucket = await ask('storageBucket', config.storageBucket);
  config.messagingSenderId = await ask('messagingSenderId', config.messagingSenderId);
  config.appId = await ask('appId', config.appId);
  config.measurementId = await ask('measurementId (optional)', config.measurementId);

  const missing = Object.entries(config).filter(([, value]) => !value).map(([key]) => key);
  if (missing.length) {
    throw new Error(`Missing Firebase value(s): ${missing.join(', ')}`);
  }

  writeEnv(config);
  console.log(`Created ${path.relative(root, envPath)}.`);

  const setProject = (await rl.question('Create .firebaserc with this project as default? [Y/n]: ')).trim().toLowerCase();
  if (setProject !== 'n' && setProject !== 'no') {
    writeFirebaserc(config.projectId);
    console.log(`Created ${path.relative(root, firebasercPath)}.`);
  }

  console.log('Firebase client setup is ready. Run: npm run dev');
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
} finally {
  rl.close();
}
