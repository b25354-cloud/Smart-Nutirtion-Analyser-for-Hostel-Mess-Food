import type { ServiceResult } from '@/types';
import type { MealLog } from '@/types/domain';
import { mealLogSchema } from '@/schemas/zod/domain.schemas';

export const validateMealLog = (input: MealLog): ServiceResult<MealLog> => {
  const result = mealLogSchema.safeParse(input);

  if (!result.success) {
    return {
      ok: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Meal log validation failed',
        details: result.error.flatten(),
      },
    };
  }

  return { ok: true, data: result.data };
};
