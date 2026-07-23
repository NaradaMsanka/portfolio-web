import { getApp, getApps, initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const requiredConfigKeys = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'];

export const isFirebaseConfigured = requiredConfigKeys.every((key) => Boolean(firebaseConfig[key]));

export function getClientApp() {
  if (!isFirebaseConfigured) throw new Error('Firebase environment variables are not configured.');
  return getApps().length ? getApp() : initializeApp(firebaseConfig);
}

export function getClientDatabase() {
  return getFirestore(getClientApp());
}

export async function getClientAnalytics() {
  if (!firebaseConfig.measurementId || typeof window === 'undefined') return null;
  const [{ getAnalytics, isSupported }, app] = await Promise.all([
    import('firebase/analytics'),
    Promise.resolve(getClientApp()),
  ]);
  return (await isSupported()) ? getAnalytics(app) : null;
}
