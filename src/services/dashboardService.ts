import {
  collection,
  getDocs,
  query,
  where,
  
} from "firebase/firestore";

import { firestoreDb } from "@/firebase";

/**
 * Returns today's logged meals.
 */
export async function getTodaysMeals() {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
  });

  const q = query(
  collection(firestoreDb, "meal_logs"),
  where("day", "==", today)
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as any),
  }));
}