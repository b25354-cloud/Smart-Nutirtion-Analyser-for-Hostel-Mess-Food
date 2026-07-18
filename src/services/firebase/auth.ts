import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User,
  getAuth,
} from 'firebase/auth';

import { firebaseApp } from '@/services/firebase/config';

const auth = getAuth(firebaseApp);
const googleProvider = new GoogleAuthProvider();

export const observeAuthState = (onChange: (user: User | null) => void) => onAuthStateChanged(auth, onChange);

export const signInWithGoogle = async () => signInWithPopup(auth, googleProvider);

export const signOutUser = async () => signOut(auth);
