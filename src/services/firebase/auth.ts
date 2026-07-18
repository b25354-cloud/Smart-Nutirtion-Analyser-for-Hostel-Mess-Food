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
