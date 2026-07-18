export const collectionNames = {
  institutes: 'institutes',
  users: 'users',
  foods: 'foods',
  dailyMenus: 'dailyMenus',
  mealLogs: 'mealLogs',
  nutritionHistory: 'nutritionHistory',
  chatHistory: 'chatHistory',
} as const;

export type CollectionName = (typeof collectionNames)[keyof typeof collectionNames];

export const supportedInstituteIds = ['iit_mandi', 'iit_delhi', 'nit_trichy'] as const;

export type SupportedInstituteId = (typeof supportedInstituteIds)[number];

export const firestoreKeyStrategies = {
  dailyMenu: 'instituteId_yyyy-mm-dd',
  mealLog: 'auto-id with userId+date+mealType fields indexed',
  nutritionSummary: 'userId_period_yyyy-mm-dd',
  chatHistory: 'auto-id with userId indexed',
} as const;
