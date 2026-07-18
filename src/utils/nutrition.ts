import type { NutritionProfile } from '@/types';

const ZERO_NUTRIENTS: NutritionProfile = {
  calories: 0,
  protein: 0,
  fat: 0,
  carbohydrates: 0,
  fiber: 0,
  sugar: 0,
  iron: 0,
  calcium: 0,
  vitaminC: 0,
  vitaminA: 0,
  potassium: 0,
  sodium: 0,
  glycemicIndex: 0,
};

export const aggregateNutrients = (
  profiles: NutritionProfile[],
): NutritionProfile =>
  profiles.reduce(
    (acc, p) => ({
      calories: acc.calories + p.calories,
      protein: acc.protein + p.protein,
      fat: acc.fat + p.fat,
      carbohydrates: acc.carbohydrates + p.carbohydrates,
      fiber: acc.fiber + p.fiber,
      sugar: acc.sugar + p.sugar,
      iron: acc.iron + p.iron,
      calcium: acc.calcium + p.calcium,
      vitaminC: acc.vitaminC + p.vitaminC,
      vitaminA: acc.vitaminA + p.vitaminA,
      potassium: acc.potassium + p.potassium,
      sodium: acc.sodium + p.sodium,
      glycemicIndex: acc.glycemicIndex + p.glycemicIndex,
    }),
    ZERO_NUTRIENTS,
  );