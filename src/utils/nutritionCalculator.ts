import type { FoodData } from "./foodParser";

export interface NutritionTotals {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  fiber: number;
  iron: number;
  calcium: number;
  vitaminC: number;
  vitaminA: number;
  potassium: number;
  sodium: number;
}

export function calculateMealNutrition(
  foods: { food: FoodData; serving: number }[]
): NutritionTotals {
  return foods.reduce(
    (total, item) => {
      total.calories += item.food.calories_kcal * item.serving;
      total.protein += item.food.protein_g * item.serving;
      total.fat += item.food.fat_g * item.serving;
      total.carbs += item.food.carbohydrates_g * item.serving;
      total.fiber += item.food.fiber_g * item.serving;
      total.iron += item.food.iron_mg * item.serving;
      total.calcium += item.food.calcium_mg * item.serving;
      total.vitaminC += item.food.vitaminC_mg * item.serving;
      total.vitaminA += item.food.vitaminA_ug * item.serving;
      total.potassium += item.food.potassium_mg * item.serving;
      total.sodium += item.food.sodium_mg * item.serving;

      return total;
    },
    {
      calories: 0,
      protein: 0,
      fat: 0,
      carbs: 0,
      fiber: 0,
      iron: 0,
      calcium: 0,
      vitaminC: 0,
      vitaminA: 0,
      potassium: 0,
      sodium: 0,
    }
  );
}

export function calculateRemainingNutrition(
  target: any,
  consumed: NutritionTotals
) {
  return {
    calories: (target.calories - consumed.calories),
    protein: (target.protein - consumed.protein),
    fat: ((target.fat ?? 0) - consumed.fat),
    carbohydrates: ((target.carbohydrates ?? 0) - consumed.carbs),
    fiber: ( target.fiber - consumed.fiber),
    iron: (target.iron - consumed.iron),
    calcium: ( target.calcium - consumed.calcium),
    vitaminC: ( target.vitaminC - consumed.vitaminC),
    vitaminA: (target.vitaminA - consumed.vitaminA),
    potassium: (target.potassium - consumed.potassium),
    sodium: ((target.sodium ?? 0) - consumed.sodium),
  };
}

export function calculateNutritionScore(consumed: any, target: any): number {
  const nutrients = [
    { key: "calories", targetKey: "calories", weight: 25 },

    { key: "protein", targetKey: "protein", weight: 20 },

    { key: "carbs", targetKey: "carbohydrates", weight: 10 },

    { key: "fat", targetKey: "fat", weight: 10 },

    { key: "fiber", targetKey: "fiber", weight: 10 },

    { key: "iron", targetKey: "iron", weight: 6 },

    { key: "calcium", targetKey: "calcium", weight: 6 },

    { key: "vitaminC", targetKey: "vitaminC", weight: 4 },

    { key: "vitaminA", targetKey: "vitaminA", weight: 3 },

    { key: "potassium", targetKey: "potassium", weight: 3 },

    { key: "sodium", targetKey: "sodium", weight: 3 },
  ];

  let totalWeight = 0;
  let weightedScore = 0;

  for (const nutrient of nutrients) {
    const consumedValue = consumed[nutrient.key] ?? 0;
    const targetValue = target[nutrient.targetKey] ?? 0;

    if (targetValue <= 0) continue;

    const ratio = consumedValue / targetValue;

    let score = 0;

    if (ratio >= 0.9 && ratio <= 1.1) {
      score = 100;
    }

    else if (ratio >= 0.7 && ratio < 0.9) {
      score = 80 + ((ratio - 0.7) / 0.2) * 20;
    }

    else if (ratio >= 0.5 && ratio < 0.7) {
      score = 50 + ((ratio - 0.5) / 0.2) * 30;
    }

    else if (ratio < 0.5) {
      score = ratio * 100;
    }

    else if (ratio > 1.1 && ratio <= 1.3) {
      score = 100 - ((ratio - 1.1) / 0.2) * 25;
    }

    else if (ratio > 1.3 && ratio <= 1.6) {
      score = 75 - ((ratio - 1.3) / 0.3) * 40;
    }

    else if (ratio > 1.6 && ratio <= 2.0) {
      score = 35 - ((ratio - 1.6) / 0.4) * 25;
    }

    else {
      score = 5;
    }

    weightedScore += score * nutrient.weight;
    totalWeight += nutrient.weight;
  }

  return Math.max(
    0,
    Math.min(100, Math.round(weightedScore / totalWeight))
  );
}