import { z } from 'zod';

export const nutrientProfileSchema = z.object({
  calories: z.number().nonnegative(),
  proteinG: z.number().nonnegative(),
  carbsG: z.number().nonnegative(),
  fatG: z.number().nonnegative(),
  fiberG: z.number().nonnegative(),
  ironMg: z.number().nonnegative(),
  calciumMg: z.number().nonnegative(),
  vitaminB12Mcg: z.number().nonnegative(),
});

export const mealLogSchema = z.object({
  id: z.string().min(1),
  uid: z.string().min(1),
  collegeId: z.string().min(1),
  messId: z.string().min(1),
  date: z.string().min(1),
  mealType: z.enum(['breakfast', 'lunch', 'dinner']),
  selectedItemIds: z.array(z.string()),
  source: z.literal('menu'),
});
