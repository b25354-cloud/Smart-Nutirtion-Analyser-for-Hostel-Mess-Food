import { Navigate, Outlet } from 'react-router-dom';

import { APP_ROUTES } from '@/app/router/constants';
import { useAuthStore } from '@/app/store';
import type { UserRole } from '@/types/domain';
import { hasRole } from '@/utils/roleGuards';

interface RoleRouteProps {
  allowedRoles: readonly UserRole[];
}

export const RoleRoute = ({ allowedRoles }: RoleRouteProps) => {
  const currentUser = useAuthStore((state) => state.currentUser);

  if (!currentUser) {
    return <Navigate to={APP_ROUTES.dashboard} replace />;
  }

  return hasRole(currentUser, allowedRoles) ? <Outlet /> : <Navigate to={APP_ROUTES.dashboard} replace />;
};
