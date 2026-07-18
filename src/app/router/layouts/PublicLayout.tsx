import { Outlet } from 'react-router-dom';

export const PublicLayout = () => (
  <main className="min-h-screen bg-surface px-4 py-8 text-text-primary">
    <Outlet />
  </main>
);
