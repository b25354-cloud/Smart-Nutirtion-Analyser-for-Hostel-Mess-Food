export const collectionNames = {
  colleges: 'colleges',
  users: 'users',
  hostels: 'hostels',
  messes: 'messes',
  menus: 'menus',
  foodItems: 'foodItems',
  mealLogs: 'mealLogs',
  dailyNutrition: 'dailyNutrition',
  weeklyNutrition: 'weeklyNutrition',
  aiInsights: 'aiInsights',
} as const;

export type CollectionName = (typeof collectionNames)[keyof typeof collectionNames];

export const firestoreKeyStrategies = {
  dailyNutrition: 'uid_yyyy-mm-dd',
  weeklyNutrition: 'uid_weekStartDate',
  menu: 'collegeId_messId_yyyy-mm-dd',
  mealLog: 'auto-id with uid+date indexed fields',
} as const;
