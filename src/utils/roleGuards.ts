import type { UserProfile, UserRole } from '@/types';

export const hasRole = (user: UserProfile, allowedRoles: readonly UserRole[]): boolean =>
  allowedRoles.includes(user.role);
