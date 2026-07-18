import { useContext } from 'react';

import { AuthContext } from '@/app/providers/AuthProvider';
import type { AuthContextValue } from '@/modules/auth/types';

export const useAuthContext = (): AuthContextValue => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }

  return context;
};
