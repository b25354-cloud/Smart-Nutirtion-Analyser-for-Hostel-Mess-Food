import Papa from "papaparse";
import targetCSV from "@/data/meal_wise_daily_nutrition_targets.csv?raw";

export interface NutritionTarget {
  meal: string;
  calories: number;
  protein: number;
  fat: number;
  carbohydrates: number;
  fiber: number;
  iron: number;
  calcium: number;
  vitaminC: number;
  vitaminA: number;
  potassium: number;
  sodium: number;
}

let cachedTargets: NutritionTarget[] | null = null;

export function loadTargets() {
  if (cachedTargets) return cachedTargets;

  const parsed = Papa.parse(targetCSV, {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
  });

  cachedTargets = parsed.data as NutritionTarget[];

  return cachedTargets;
}

export function getMealTarget(meal: string) {
  const rows = loadTargets();

  const daily = rows.filter((r: any) => r.meal === "daily");
  const currentMeal = meal.toLowerCase();
    const mealShare = rows.filter(
        (r: any) => r.meal.toLowerCase() === currentMeal
    );
  console.log(rows);
  console.log(meal);
  console.log(mealShare); 
  const dailyMap: any = {};
  daily.forEach((r: any) => {
    dailyMap[r.nutrient] = r.target_value;
  });

  const target: any = {};

  mealShare.forEach((r: any) => {
    const dailyValue = dailyMap[r.nutrient];
    if (dailyValue !== undefined) {
      target[r.nutrient] = (dailyValue * r.target_value) / 100;
    }
  });

  const mealPercent =
  mealShare.length > 0 ? (mealShare[0] as any).target_value : 0;

const dailyCalories = dailyMap.calories_kcal ?? 2200;
const dailyProtein = dailyMap.protein_g ?? 55;
const dailyFat = dailyMap.fat_g_max ?? 73;

const dailyCarbs = (dailyCalories - (dailyProtein * 4) - (dailyFat * 9)) / 4;

return {
  calories: target.calories_kcal ?? 0,
  protein: target.protein_g ?? 0,
  fat: (dailyFat * mealPercent) / 100,
  carbohydrates: (dailyCarbs * mealPercent) / 100,
  fiber: target.fiber_g ?? 0,
  iron: target.iron_mg ?? 0,
  calcium: target.calcium_mg ?? 0,
  vitaminC: target.vitaminC_mg ?? 0,
  vitaminA: target.vitaminA_ug ?? 0,
  potassium: target.potassium_mg ?? 0,
  sodium: ((dailyMap.sodium_mg_max ?? 2000) * mealPercent) / 100,
};
}

export function getDailyTarget() {
  const rows = loadTargets();

  const daily = rows.filter((r: any) => r.meal === "daily");

  const map: any = {};

  daily.forEach((r: any) => {
    map[r.nutrient] = r.target_value;
  });

  const dailyCalories = map.calories_kcal ?? 2200;
  const dailyProtein = map.protein_g ?? 55;
  const dailyFat = map.fat_g_max ?? 73;

  const dailyCarbs =
    (dailyCalories - dailyProtein * 4 - dailyFat * 9) / 4;

  return {
    calories: dailyCalories,
    protein: dailyProtein,
    fat: dailyFat,
    carbohydrates: dailyCarbs,
    fiber: map.fiber_g_min ?? 25,
    iron: map.iron_mg ?? 14,
    calcium: map.calcium_mg ?? 1000,
    vitaminC: map.vitaminC_mg ?? 65,
    vitaminA: map.vitaminA_ug ?? 600,
    potassium: map.potassium_mg ?? 3500,
    sodium: map.sodium_mg_max ?? 2000,
  };
}