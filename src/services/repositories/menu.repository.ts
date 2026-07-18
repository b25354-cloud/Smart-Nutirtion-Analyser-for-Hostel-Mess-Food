import type { MessMenu, ServiceResult } from '@/types';
import { toServiceError } from '@/utils/error';

export const menuRepository = {
  async getMenuByDate(collegeId: string, messId: string, date: string): Promise<ServiceResult<MessMenu | null>> {
    try {
      // TODO: Implement Firestore query by collegeId + messId + date
      void collegeId;
      void messId;
      void date;
      return { ok: true, data: null };
    } catch (error) {
      return { ok: false, error: toServiceError(error, 'Unable to load menu') };
    }
  },
};
