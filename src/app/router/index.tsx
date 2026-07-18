import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import { ROUTES } from '@/app/router/constants';
import { ProtectedRoute } from '@/app/router/guards/ProtectedRoute';
import { RoleRoute } from '@/app/router/guards/RoleRoute';
import { AdminLayout } from '@/app/router/layouts/AdminLayout';
import { AppLayout } from '@/app/router/layouts/AppLayout';
import { PublicLayout } from '@/app/router/layouts/PublicLayout';
import { NotFoundPage } from '@/app/router/pages/NotFoundPage';
import { RouteStubPage } from '@/app/router/pages/RouteStubPage';
import { adminRouteTree, appRouteTree } from '@/app/router/routeTree';

const router = createBrowserRouter([
  {
    path: ROUTES.home,
    element: <PublicLayout />,
    children: [
      { index: true, element: <RouteStubPage title="MessMate AI" description="Public landing shell." /> },
      { path: ROUTES.auth, element: <RouteStubPage title="Authentication" description="Firebase auth flow scaffold." /> },
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
          element: <RouteStubPage title={route.title} description="Protected route scaffold." />,
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
              element: <RouteStubPage title={route.title} description="Role-aware route scaffold." />,
            })),
          },
        ],
      },
    ],
  },
  { path: ROUTES.notFound, element: <NotFoundPage /> },
]);

export const AppRouter = () => <RouterProvider router={router} />;
