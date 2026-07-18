export type MealType = "breakfast" | "lunch" | "dinner";

export interface MenuFoodItem {
  id: string;
  name: string;
}

export interface DailyMenuEditor {
  date: string;
  breakfast: MenuFoodItem[];
  lunch: MenuFoodItem[];
  dinner: MenuFoodItem[];
}