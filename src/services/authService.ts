
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";

import {
  doc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

import {
  firebaseAuth,
  firestoreDb,
} from "@/firebase";

export interface SignupData {
  name: string;
  rollNo: string;
  email: string;
  password: string;
}

export async function signup({
  name,
  rollNo,
  email,
  password,
}: SignupData) {
  const credential =
    await createUserWithEmailAndPassword(
      firebaseAuth,
      email,
      password
    );

  const user = credential.user;

  await updateProfile(user, {
    displayName: name,
  });

  await setDoc(doc(firestoreDb, "users", user.uid), {
    uid: user.uid,
    name,
    rollNo,
    email,
    createdAt: serverTimestamp(),
  });

  return user;
}

export async function login(
  email: string,
  password: string
) {
  const credential =
    await signInWithEmailAndPassword(
      firebaseAuth,
      email,
      password
    );

  return credential.user;
}

export async function logout() {
  await signOut(firebaseAuth);
}

export function getCurrentUser() {
    return firebaseAuth.currentUser;
}