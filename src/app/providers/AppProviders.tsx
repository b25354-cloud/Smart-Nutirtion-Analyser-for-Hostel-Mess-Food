import type { PropsWithChildren } from 'react';

import { AuthProvider } from '@/app/providers/AuthProvider';
import { QueryProvider } from '@/app/providers/QueryProvider';
import { ThemeProvider } from '@/app/providers/ThemeProvider';

export const AppProviders = ({ children }: PropsWithChildren) => (
  <ThemeProvider>
    <QueryProvider>
      <AuthProvider>{children}</AuthProvider>
    </QueryProvider>
  </ThemeProvider>
);
