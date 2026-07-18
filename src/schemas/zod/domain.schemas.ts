import { z } from 'zod';

export const nutritionProfileSchema = z.object({
  calories: z.number().nonnegative(),
  protein: z.number().nonnegative(),
  fat: z.number().nonnegative(),
  carbohydrates: z.number().nonnegative(),
  fiber: z.number().nonnegative(),
  sugar: z.number().nonnegative(),
  iron: z.number().nonnegative(),
  calcium: z.number().nonnegative(),
  vitaminC: z.number().nonnegative(),
  vitaminA: z.number().nonnegative(),
  potassium: z.number().nonnegative(),
  sodium: z.number().nonnegative(),
  glycemicIndex: z.number().nonnegative(),
});

export const mealSchema = z.object({
  foodId: z.string().min(1),
  quantity: z.number().positive(),
});

export const mealLogSchema = z.object({
  id: z.string().min(1),
  userId: z.string().min(1),
  instituteId: z.string().min(1),
  date: z.string().min(1),
  mealType: z.enum(['breakfast', 'lunch', 'dinner']),
  meals: z.array(mealSchema),
  nutrition: nutritionProfileSchema,
  sourceMenuId: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});