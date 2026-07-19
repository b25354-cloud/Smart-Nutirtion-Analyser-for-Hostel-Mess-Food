import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import { ROUTES, APP_ROUTES, ADMIN_ROUTES } from '@/app/router/constants';
import { ProtectedRoute } from '@/app/router/guards/ProtectedRoute';
import { RoleRoute } from '@/app/router/guards/RoleRoute';
import { AdminLayout } from '@/app/router/layouts/AdminLayout';
import { AppLayout } from '@/app/router/layouts/AppLayout';
import { PublicLayout } from '@/app/router/layouts/PublicLayout';
import { LandingPage } from '@/app/router/pages/LandingPage';
import { LoginPage } from '@/app/router/pages/LoginPage'; // <-- Added import
import { NotFoundPage } from '@/app/router/pages/NotFoundPage';
import { RouteStubPage } from '@/app/router/pages/RouteStubPage';
import { adminRouteTree, appRouteTree } from '@/app/router/routeTree';
import AdminMenuPage from "@/modules/mess-menu/pages/AdminMenuPage";
import StudentTrackerPage from "@/modules/tracking/pages/StudentTrackerPage";
import StudentDashboardPage from "@/pages/StudentDashboard";
import { ProfilePage } from '@/app/router/pages/ProfilePage';
import DailyAnalysisPage from "@/pages/DailyAnalysisPage"; // Adjust the path if it's in a different folder
const router = createBrowserRouter([
  {
    path: ROUTES.home,
    element: <PublicLayout />,
    children: [
      { index: true, element: <LandingPage /> },
      // <-- Replaced the Auth stub with the actual LoginPage
      { path: ROUTES.auth, element: <LoginPage /> }, 
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/app',
        element: <AppLayout />,
        children: appRouteTree.map((route) => ({
          path: route.path,
          element:
            route.path === APP_ROUTES.dashboard ? (
              <StudentDashboardPage />
            ) : route.path === APP_ROUTES.tracking ? (
              <StudentTrackerPage />
            ) : route.path === APP_ROUTES.profile ? (
              <ProfilePage /> // <-- ADDED THE PROFILE PAGE HERE
            ) : route.path === APP_ROUTES.daily ? ( // <-- ADD THIS BLOCK
              <DailyAnalysisPage />
            ) : (
              <RouteStubPage
                title={route.title}
                description="Protected route scaffold."
              />
            ),
        })),
      },
      {
        element: <RoleRoute allowedRoles={['admin', 'mess_manager']} />,
        children: [
          {
            path: '/admin',
            element: <AdminLayout />,
            children: adminRouteTree.map((route) => ({
              path: route.path,
              element:
                route.path === ADMIN_ROUTES.menus ? (
                  <AdminMenuPage />
                ) : (
                  <RouteStubPage
                    title={route.title}
                    description="Role-aware route scaffold."
                  />
                ),
            })),
          },
        ],
      },
    ],
  },
  { path: ROUTES.notFound, element: <NotFoundPage /> },
]);

export const AppRouter = () => <RouterProvider router={router} />;