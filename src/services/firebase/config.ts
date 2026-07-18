import { env } from '@/config/env';
import { firebaseApp, firebaseAuth, firebaseStorage, firestoreDb } from '@/firebase';

export { firebaseApp, firebaseAuth, firebaseStorage, firestoreDb };

export const firebaseProjectConfig = {
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
} as const;

export const isFirebaseConfigured = (): boolean =>
  Object.values(firebaseProjectConfig).every((value) => typeof value === 'string' && value.length > 0);
