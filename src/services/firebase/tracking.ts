import { collection, doc, setDoc, query, where, getDocs } from 'firebase/firestore';
import { firestoreDb as db } from './config';

export interface TrackedMeal {
  id?: string;
  userId: string;
  date: string; // Format: YYYY-MM-DD
  mealsConsumed: any[]; // You will replace 'any' with your actual food/menu item type
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFats: number;
  timestamp: number;
}

/**
 * Saves a user's tracked meals for a specific day to Firestore.
 */
export const saveDailyMealLog = async (userId: string, date: string, mealData: Omit<TrackedMeal, 'userId' | 'date' | 'timestamp'>) => {
  try {
    // Create a unique document ID based on the user and the date (e.g., "user123_2026-07-19")
    const docId = `${userId}_${date}`;
    const mealLogRef = doc(db, 'meal_logs', docId);

    const fullLog: TrackedMeal = {
      userId,
      date,
      ...mealData,
      timestamp: Date.now(),
    };

    await setDoc(mealLogRef, fullLog, { merge: true }); // merge: true updates existing data for that day
    return { ok: true, data: fullLog };
  } catch (error: any) {
    console.error("Error saving meal log:", error);
    return { ok: false, error: error.message };
  }
};

/**
 * Fetches the last 7 days of meal logs for a specific user.
 */
export const getWeeklyMealLogs = async (userId: string) => {
  try {
    const logsRef = collection(db, 'meal_logs');
    
    // Removed orderBy() so Firebase doesn't block the read with an Index error
    const q = query(
      logsRef, 
      where('userId', '==', userId)
    );

    const querySnapshot = await getDocs(q);
    let logs: TrackedMeal[] = [];
    
    querySnapshot.forEach((doc) => {
      logs.push({ id: doc.id, ...doc.data() } as TrackedMeal);
    });

    // Sort by date locally
    logs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    logs = logs.slice(0, 7);

    return { ok: true, data: logs };
  } catch (error: any) {
    console.error("Error fetching weekly logs:", error);
    return { ok: false, error: error.message };
  }
};