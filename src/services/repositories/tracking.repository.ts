import type { MealLog, ServiceResult } from '@/types';
import { toServiceError } from '@/utils/error';

export const trackingRepository = {
  async logMeal(mealLog: MealLog): Promise<ServiceResult<string>> {
    try {
      // TODO: Implement Firestore write for mealLogs collection
      void mealLog;
      return { ok: true, data: 'TODO' };
    } catch (error) {
      return { ok: false, error: toServiceError(error, 'Unable to save meal log') };
    }
  },

  async getMealLogsByDate(uid: string, date: string): Promise<ServiceResult<MealLog[]>> {
    try {
      // TODO: Implement Firestore query by uid and date
      void uid;
      void date;
      return { ok: true, data: [] };
    } catch (error) {
      return { ok: false, error: toServiceError(error, 'Unable to fetch meal logs') };
    }
  },
};
