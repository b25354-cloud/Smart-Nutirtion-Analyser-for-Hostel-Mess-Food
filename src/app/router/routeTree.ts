import { ADMIN_ROUTES, APP_ROUTES } from '@/app/router/constants';
import type { UserRole } from '@/types';

export interface RouteMeta {
  requiresAuth?: boolean;
  roles?: readonly UserRole[];
  collegeScoped?: boolean;
}

export interface AppRouteNode {
  path: string;
  title: string;
  meta: RouteMeta;
}

export const appRouteTree: readonly AppRouteNode[] = [
  { path: APP_ROUTES.dashboard, title: 'Dashboard', meta: { requiresAuth: true, collegeScoped: true } },
  { path: APP_ROUTES.tracking, title: 'Meal Tracking', meta: { requiresAuth: true, collegeScoped: true } },
  { path: APP_ROUTES.daily, title: 'Daily Nutrition', meta: { requiresAuth: true, collegeScoped: true } },
  { path: APP_ROUTES.weekly, title: 'Weekly Trends', meta: { requiresAuth: true, collegeScoped: true } },
  { path: APP_ROUTES.coach, title: 'AI Coach', meta: { requiresAuth: true, collegeScoped: true } },
  { path: APP_ROUTES.profile, title: 'Profile', meta: { requiresAuth: true, collegeScoped: true } },
  { path: APP_ROUTES.settings, title: 'Settings', meta: { requiresAuth: true, collegeScoped: true } },
] as const;

export const adminRouteTree: readonly AppRouteNode[] = [
  {
    path: ADMIN_ROUTES.colleges,
    title: 'Admin Colleges',
    meta: { requiresAuth: true, roles: ['admin', 'mess_manager'], collegeScoped: true },
  },
  {
    path: ADMIN_ROUTES.menus,
    title: 'Admin Menus',
    meta: { requiresAuth: true, roles: ['admin', 'mess_manager'], collegeScoped: true },
  },
  {
    path: ADMIN_ROUTES.nutrientDb,
    title: 'Admin Nutrient DB',
    meta: { requiresAuth: true, roles: ['admin', 'mess_manager'], collegeScoped: true },
  },
] as const;
