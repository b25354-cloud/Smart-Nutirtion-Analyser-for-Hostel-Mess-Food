export const ROUTES = {
  home: '/',
  auth: '/auth',
  app: '/app',
  admin: '/admin',
  notFound: '*',
} as const;

export const APP_ROUTES = {
  dashboard: '/app/dashboard',
  tracking: '/app/track',
  dailyBase: '/app/daily',
  daily: '/app/daily/:date',
  weekly: '/app/weekly',
  coach: '/app/coach',
  profile: '/app/profile',
  settings: '/app/settings',
} as const;

export const ADMIN_ROUTES = {
  colleges: '/admin/colleges',
  menus: '/admin/menus',
  nutrientDb: '/admin/nutrient-db',
} as const;
