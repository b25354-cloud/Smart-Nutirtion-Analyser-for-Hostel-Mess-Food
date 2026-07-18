import { Outlet } from 'react-router-dom';

import { AppShell } from '@/components/layout';

export const AppLayout = () => (
  <AppShell>
    <Outlet />
  </AppShell>
);
