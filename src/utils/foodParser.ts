import Papa from "papaparse";
import foodCSV from "@/data/messmate_master_food_nutrition_dataset.csv?raw";

export interface FoodData {
  food_id: string;
  name: string;
  aliases: string;
  category: string;
  serving_size: number;
  serving_unit: string;

  calories_kcal: number;
  protein_g: number;
  fat_g: number;
  carbohydrates_g: number;
  fiber_g: number;

  iron_mg: number;
  calcium_mg: number;
  vitaminC_mg: number;
  vitaminA_ug: number;
  potassium_mg: number;
  sodium_mg: number;

  source: string;
}

let cachedFoods: FoodData[] | null = null;

export function loadFoodDatabase(): FoodData[] {
  if (cachedFoods) return cachedFoods;

  const parsed = Papa.parse(foodCSV, {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
  });

  cachedFoods = parsed.data as FoodData[];

  return cachedFoods;
}

export function getFoodByName(name: string): FoodData | undefined {
  const search = name.toLowerCase().trim();

  return loadFoodDatabase().find((food) => {
    const foodName = food.name.toLowerCase();

    if (foodName === search) return true;

    if (search.includes(foodName)) return true;

    if (
      food.aliases &&
      food.aliases
        .toLowerCase()
        .split(",")
        .some((a) => search.includes(a.trim()))
    ) {
      return true;
    }

    return false;
  });
}

export function getFoodById(id: string): FoodData | undefined {
  return loadFoodDatabase().find(
    (food) => food.food_id === id
  );
}