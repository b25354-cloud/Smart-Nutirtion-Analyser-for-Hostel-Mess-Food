import type { PropsWithChildren } from 'react';

import { Sidebar } from '@/components/layout/Sidebar';
import { TopNav } from '@/components/layout/TopNav';

export const AppShell = ({ children }: PropsWithChildren) => (
  <div className="flex min-h-screen bg-surface text-text-primary">
    <Sidebar />
    <div className="flex min-h-screen flex-1 flex-col">
      <TopNav />
      <main className="flex-1 p-6">{children}</main>
    </div>
  </div>
);
