import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { ROUTES } from '@/app/router/constants';
import { useAuthStore } from '@/app/store';
import { Loader } from '@/components/common';

export const ProtectedRoute = () => {
  const location = useLocation();
  const { isAuthReady, currentUser } = useAuthStore();

  if (!isAuthReady) {
    return <Loader label="Checking session..." />;
  }

  if (!currentUser) {
    return <Navigate to={ROUTES.auth} replace state={{ from: location }} />;
  }

  return <Outlet />;
};
