import type { UserProfile } from '@/types';

export interface AuthContextValue {
  isAuthReady: boolean;
  currentUser: UserProfile | null;
}
