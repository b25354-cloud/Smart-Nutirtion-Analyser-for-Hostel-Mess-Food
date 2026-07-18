import {
  GoogleAuthProvider,
  type User,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from 'firebase/auth';

import { firebaseAuth } from '@/firebase';

const googleProvider = new GoogleAuthProvider();

export const observeAuthState = (onChange: (user: User | null) => void) => onAuthStateChanged(firebaseAuth, onChange);

export const signInWithGoogle = async () => signInWithPopup(firebaseAuth, googleProvider);

export const signOutUser = async () => signOut(firebaseAuth);
