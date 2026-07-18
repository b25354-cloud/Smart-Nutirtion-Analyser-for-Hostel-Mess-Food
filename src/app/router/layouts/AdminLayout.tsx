import { Outlet } from 'react-router-dom';

import { AppShell } from '@/components/layout';

export const AdminLayout = () => (
  <AppShell>
    <Outlet />
  </AppShell>
);
