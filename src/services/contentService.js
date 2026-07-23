import { useEffect, useState } from 'react';

const firebaseConfigured = [
  import.meta.env.VITE_FIREBASE_API_KEY,
  import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  import.meta.env.VITE_FIREBASE_PROJECT_ID,
  import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  import.meta.env.VITE_FIREBASE_APP_ID,
].every(Boolean);

export function usePublishedContent(collectionName, fallbackItems) {
  const [state, setState] = useState({ items: firebaseConfigured ? [] : fallbackItems, loading: firebaseConfigured, error: '' });

  useEffect(() => {
    if (!firebaseConfigured) return undefined;
    let active = true;
    async function load() {
      try {
        const [{ collection, getDocs, query, where }, { getClientDatabase }] = await Promise.all([import('firebase/firestore'), import('../firebase')]);
        const snapshot = await getDocs(query(collection(getClientDatabase(), collectionName), where('published', '==', true)));
        const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })).sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
        if (active) setState({ items, loading: false, error: '' });
      } catch (error) {
        console.error(`Unable to load ${collectionName}`, error);
        if (active) setState({ items: [], loading: false, error: `Unable to load ${collectionName}.` });
      }
    }
    load();
    return () => { active = false; };
  }, [collectionName]);

  return state;
}
