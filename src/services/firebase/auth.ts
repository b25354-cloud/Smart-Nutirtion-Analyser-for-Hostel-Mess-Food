import {
  GoogleAuthProvider,
  type User,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from 'firebase/auth';

import { firebaseAuth } from '@/services/firebase/config';
import type { ServiceResult } from '@/types';
import { toServiceError } from '@/utils/error';
// Add this to: src/services/firebase/auth.ts
import { signInWithEmailAndPassword } from "firebase/auth";

export const loginWithEmail = async (email: string, password: string): Promise<ServiceResult<User>> => {
  try {
    const credential = await signInWithEmailAndPassword(firebaseAuth, email, password);
    return { ok: true, data: credential.user };
  } catch (error) {
    // This safely catches the error and formats it using your project's custom error utility
    return { ok: false, error: toServiceError(error, 'Unable to sign in with email and password') };
  }
};
const googleProvider = new GoogleAuthProvider();

export const observeAuthState = (onChange: (user: User | null) => void) => onAuthStateChanged(firebaseAuth, onChange);

export const signInWithGoogle = async (): Promise<ServiceResult<User>> => {
  try {
    const credential = await signInWithPopup(firebaseAuth, googleProvider);
    return { ok: true, data: credential.user };
  } catch (error) {
    return { ok: false, error: toServiceError(error, 'Unable to sign in with Google') };
  }
};

export const signOutUser = async (): Promise<ServiceResult<void>> => {
  try {
    await signOut(firebaseAuth);
    return { ok: true, data: undefined };
  } catch (error) {
    return { ok: false, error: toServiceError(error, 'Unable to sign out') };
  }
};

export const getAuthenticatedUser = (): User | null => firebaseAuth.currentUser;
