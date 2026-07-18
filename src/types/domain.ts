export type UserRole = 'student' | 'admin' | 'mess_manager';

export type MealType = 'breakfast' | 'lunch' | 'dinner';

export interface College {
  id: string;
  code: string;
  name: string;
  timezone: string;
  active: boolean;
}

export interface Hostel {
  id: string;
  collegeId: string;
  messId: string;
  name: string;
}

export interface Mess {
  id: string;
  collegeId: string;
  hostelId: string;
  name: string;
}

export interface NutrientProfile {
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  fiberG: number;
  ironMg: number;
  calciumMg: number;
  vitaminB12Mcg: number;
}

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  collegeId: string;
  role: UserRole;
  hostelId?: string;
  dietaryPreferences?: string[];
}

export interface FoodItem {
  id: string;
  collegeId: string;
  name: string;
  category: string;
  servingSize: string;
  nutrients: NutrientProfile;
}

export interface MenuMeal {
  mealType: MealType;
  items: FoodItem[];
}

export interface MessMenu {
  id: string;
  collegeId: string;
  messId: string;
  date: string;
  meals: MenuMeal[];
}

export interface MealLog {
  id: string;
  uid: string;
  collegeId: string;
  messId: string;
  date: string;
  mealType: MealType;
  selectedItemIds: string[];
  source: 'menu';
}

export interface NutritionGap {
  nutrient: keyof NutrientProfile;
  target: number;
  actual: number;
  deficit: number;
}

export interface NutritionScore {
  value: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'E';
}

export interface Suggestion {
  id: string;
  title: string;
  reasoning: string;
  affordabilityRank: number;
}

export interface DailyNutritionSummary {
  id: string;
  uid: string;
  collegeId: string;
  date: string;
  totals: NutrientProfile;
  score: NutritionScore;
  gaps: NutritionGap[];
}

export interface WeeklyNutritionTrend {
  id: string;
  uid: string;
  collegeId: string;
  weekStart: string;
  scores: Array<{ date: string; score: number }>;
  recurringGaps: NutritionGap[];
}

export interface AIInsight {
  id: string;
  uid: string;
  collegeId: string;
  dateRangeKey: string;
  summary: string;
  suggestions: Suggestion[];
  generatedAt: string;
}
