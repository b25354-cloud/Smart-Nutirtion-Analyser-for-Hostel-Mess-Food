export type UserRole = 'student' | 'admin' | 'mess_manager';

export type MealType = 'breakfast' | 'lunch' | 'dinner';

export type NutritionPeriod = 'daily' | 'weekly' | 'monthly';

export type InstituteCode = 'iit_mandi' | 'iit_delhi' | 'nit_trichy' | (string & {});

export interface Institute {
  id: string;
  code: InstituteCode;
  name: string;
  timezone: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  rollNo: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface NutritionSource {
  source: string;
  sourceId?: string;
  version?: string;
  verifiedAt?: string;
}

export interface NutritionProfile {
  calories: number;
  protein: number;
  fat: number;
  carbohydrates: number;
  fiber: number;
  sugar: number;
  iron: number;
  calcium: number;
  vitaminC: number;
  vitaminA: number;
  potassium: number;
  sodium: number;
  glycemicIndex: number;
}

export interface Food {
  id: string;
  instituteId?: string;
  name: string;
  aliases: string[];
  category: string;
  servingSize: number;
  servingUnit: string;
  nutrition: NutritionProfile;
  source: NutritionSource;
  createdAt: string;
  updatedAt: string;
}

export interface Meal {
  foodId: string;
  quantity: number;
}

export interface DailyMenu {
  id: string;
  instituteId: string;
  date: string;
  breakfast: Meal[];
  lunch: Meal[];
  dinner: Meal[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface MealLog {
  id: string;
  userId: string;
  instituteId: string;
  date: string;
  mealType: MealType;
  meals: Meal[];
  nutrition: NutritionProfile;
  sourceMenuId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NutritionGoal {
  calories: number;
  protein: number;
  fat: number;
  carbohydrates: number;
  fiber: number;
  iron: number;
  calcium: number;
  vitaminC: number;
  sodium: number;
  potassium: number;
}

export interface NutritionGap {
  nutrient: keyof NutritionProfile;
  target: number;
  actual: number;
  deficit: number;
}

export interface NutritionScore {
  value: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'E';
}

export interface NutritionSummary {
  id: string;
  userId: string;
  instituteId: string;
  period: NutritionPeriod;
  startDate: string;
  endDate: string;
  totals: NutritionProfile;
  score: NutritionScore;
  gaps: NutritionGap[];
  generatedAt: string;
}

export interface ChatMessage {
  id: string;
  role: 'system' | 'user' | 'assistant';
  content: string;
  createdAt: string;
}

export interface ChatHistory {
  id: string;
  userId: string;
  instituteId: string;
  messages: ChatMessage[];
  contextSummaryIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Suggestion {
  id: string;
  title: string;
  reasoning: string;
  affordabilityRank: number;
}

export interface AIInsight {
  id: string;
  userId: string;
  instituteId: string;
  period: NutritionPeriod;
  summary: string;
  suggestions: Suggestion[];
  generatedAt: string;
}

// Backward compatible aliases for existing scaffold code.
export type College = Institute;
export type UserProfile = User;
export type FoodItem = Food;
export type MessMenu = DailyMenu;
export type DailyNutritionSummary = NutritionSummary;

export interface WeeklyNutritionTrend {
  id: string;
  userId: string;
  instituteId: string;
  weekStart: string;
  scores: Array<{ date: string; score: number }>;
  recurringGaps: NutritionGap[];
}
