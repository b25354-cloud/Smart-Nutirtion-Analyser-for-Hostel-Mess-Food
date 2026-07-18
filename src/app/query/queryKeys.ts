export const queryKeys = {
  colleges: ['colleges'] as const,
  menusByCollegeDate: (collegeId: string, date: string) => ['menus', collegeId, date] as const,
  mealLogsByUserDate: (userId: string, date: string) => ['mealLogs', userId, date] as const,
  dailyNutritionByUserDate: (userId: string, date: string) => ['dailyNutrition', userId, date] as const,
  weeklyNutritionByUserWeek: (userId: string, weekStart: string) =>
    ['weeklyNutrition', userId, weekStart] as const,
  aiInsightsByUserRange: (userId: string, rangeKey: string) => ['aiInsights', userId, rangeKey] as const,
};
