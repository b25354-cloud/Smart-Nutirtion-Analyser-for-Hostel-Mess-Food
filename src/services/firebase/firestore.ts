import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
  type CollectionReference,
  type DocumentData,
} from 'firebase/firestore';

import { firestoreDb } from '@/firebase';
import type { CollectionName } from '@/types';

export const getCollectionRef = <T extends DocumentData>(collectionName: CollectionName): CollectionReference<T> =>
  collection(firestoreDb, collectionName) as CollectionReference<T>;

export const getDocumentById = async <T extends DocumentData>(collectionName: CollectionName, id: string): Promise<T | null> => {
  const snapshot = await getDoc(doc(firestoreDb, collectionName, id));
  return snapshot.exists() ? ({ id: snapshot.id, ...(snapshot.data() as T) } as T) : null;
};

export const upsertDocument = async <T extends DocumentData>(
  collectionName: CollectionName,
  id: string,
  value: T,
): Promise<void> => {
  await setDoc(doc(firestoreDb, collectionName, id), value, { merge: true });
};

export const updateDocument = async <T extends DocumentData>(
  collectionName: CollectionName,
  id: string,
  value: Partial<T>,
): Promise<void> => {
  await updateDoc(doc(firestoreDb, collectionName, id), value as DocumentData);
};

export const deleteDocument = async (collectionName: CollectionName, id: string): Promise<void> => {
  await deleteDoc(doc(firestoreDb, collectionName, id));
};

export const queryDocumentsByField = async <T extends DocumentData>(
  collectionName: CollectionName,
  fieldName: string,
  value: unknown,
): Promise<T[]> => {
  const snapshot = await getDocs(query(collection(firestoreDb, collectionName), where(fieldName, '==', value)));
  return snapshot.docs.map((entry) => ({ id: entry.id, ...(entry.data() as T) } as T));
};

export { firestoreDb };
