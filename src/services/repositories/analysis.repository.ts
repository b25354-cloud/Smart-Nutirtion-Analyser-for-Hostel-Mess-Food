import type { DailyNutritionSummary, ServiceResult, WeeklyNutritionTrend } from '@/types';
import { toServiceError } from '@/utils/error';

export const analysisRepository = {
  async getDailySummary(uid: string, date: string): Promise<ServiceResult<DailyNutritionSummary | null>> {
    try {
      // TODO: Implement Firestore read for dailyNutrition
      void uid;
      void date;
      return { ok: true, data: null };
    } catch (error) {
      return { ok: false, error: toServiceError(error, 'Unable to fetch daily summary') };
    }
  },

  async getWeeklyTrend(uid: string, weekStart: string): Promise<ServiceResult<WeeklyNutritionTrend | null>> {
    try {
      // TODO: Implement Firestore read for weeklyNutrition
      void uid;
      void weekStart;
      return { ok: true, data: null };
    } catch (error) {
      return { ok: false, error: toServiceError(error, 'Unable to fetch weekly trend') };
    }
  },
};
