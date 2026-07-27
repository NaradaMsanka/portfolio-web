import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

import {
  getClientAuth,
  getClientDatabase,
} from "../../firebase";

const collectionNames = {
  projects: "projects",
  reviews: "reviews",
  "company-logos": "companyLogos",
  enquiries: "enquiries",
};

function createError(message, status = 500) {
  const error = new Error(message);
  error.status = status;
  return error;
}

function waitForAuthentication() {
  const auth = getClientAuth();

  return new Promise((resolve) => {
    let unsubscribe = () => {};

    unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    });
  });
}

async function requireAdmin() {
  const user = await waitForAuthentication();

  if (!user) {
    throw createError("Administrator login required.", 401);
  }

  return user;
}

function getCollectionName(type) {
  const collectionName = collectionNames[type];

  if (!collectionName) {
    throw createError("Invalid content type.", 400);
  }

  return collectionName;
}

export const adminApi = {
  async session() {
    const user = await waitForAuthentication();

    if (!user) {
      throw createError("No active session.", 401);
    }

    return {
      username: user.email,
    };
  },

  async login({ email, password }) {
    const credential = await signInWithEmailAndPassword(
      getClientAuth(),
      email.trim(),
      password
    );

    return {
      username: credential.user.email,
    };
  },

  async logout() {
    await signOut(getClientAuth());
  },

  async list(type) {
    await requireAdmin();

    const collectionName = getCollectionName(type);
    const snapshot = await getDocs(
      collection(getClientDatabase(), collectionName)
    );

    const items = snapshot.docs.map((documentSnapshot) => ({
      id: documentSnapshot.id,
      ...documentSnapshot.data(),
    }));

    return { items };
  },

  async create(type, item) {
    await requireAdmin();

    const collectionName = getCollectionName(type);

    const documentReference = await addDoc(
      collection(getClientDatabase(), collectionName),
      {
        ...item,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }
    );

    return {
      item: {
        id: documentReference.id,
        ...item,
      },
    };
  },

  async update(type, id, item) {
    await requireAdmin();

    const collectionName = getCollectionName(type);

    await updateDoc(
      doc(getClientDatabase(), collectionName, id),
      {
        ...item,
        updatedAt: serverTimestamp(),
      }
    );

    return {
      item: {
        id,
        ...item,
      },
    };
  },

  async remove(type, id) {
    await requireAdmin();

    const collectionName = getCollectionName(type);

    await deleteDoc(
      doc(getClientDatabase(), collectionName, id)
    );

    return null;
  },
};

export function uploadAdminImage({
  file,
  onProgress,
}) {
  return new Promise((resolve, reject) => {
    if (!getClientAuth().currentUser) {
      reject(new Error("Administrator login required."));
      return;
    }

    const cloudName =
      import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

    const uploadPreset =
      import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      reject(
        new Error("Cloudinary configuration is missing.")
      );
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    const xhr = new XMLHttpRequest();

    xhr.open(
      "POST",
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`
    );

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentage = Math.round(
          (event.loaded / event.total) * 100
        );

        onProgress?.(percentage);
      }
    };

    xhr.onload = () => {
      let result = {};

      try {
        result = JSON.parse(xhr.responseText);
      } catch {
        reject(new Error("Invalid Cloudinary response."));
        return;
      }

      if (xhr.status < 200 || xhr.status >= 300) {
        reject(
          new Error(
            result.error?.message || "Image upload failed."
          )
        );
        return;
      }

      resolve({
        url: result.secure_url,
        path: result.public_id,
      });
    };

    xhr.onerror = () => {
      reject(new Error("Image upload failed."));
    };

    xhr.send(formData);
  });
}
