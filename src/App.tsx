import { AppProviders } from '@/app/providers/AppProviders';
import { AppRouter } from '@/router';

export const App = () => (
  <AppProviders>
    <AppRouter />
  </AppProviders>
);
