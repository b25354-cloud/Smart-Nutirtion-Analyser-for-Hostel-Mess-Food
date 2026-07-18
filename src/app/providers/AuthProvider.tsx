import type { PropsWithChildren } from 'react';
import { useEffect } from 'react';

import { useAuthStore } from '@/app/store';
import { observeAuthState } from '@/services/firebase/auth';
import { mapFirebaseUserToProfile } from '@/services/mappers/user.mapper';

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const setCurrentUser = useAuthStore((state) => state.setCurrentUser);
  const setAuthReady = useAuthStore((state) => state.setAuthReady);

  useEffect(() => {
    const unsubscribe = observeAuthState((firebaseUser) => {
      setCurrentUser(firebaseUser ? mapFirebaseUserToProfile(firebaseUser) : null);
      setAuthReady(true);
    });

    return unsubscribe;
  }, [setAuthReady, setCurrentUser]);

  return children;
};
