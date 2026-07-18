import {
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import { firestoreDb } from "@/firebase";

export async function saveMeal(data: any) {
  await addDoc(collection(firestoreDb, "meal_logs"), {
    ...data,
    createdAt: serverTimestamp(),
  });
}