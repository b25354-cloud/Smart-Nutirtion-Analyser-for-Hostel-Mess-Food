import { create } from 'zustand';

import type { UserProfile } from '@/types/domain';

interface AuthState {
  isAuthReady: boolean;
  currentUser: UserProfile | null;
  setAuthReady: (isReady: boolean) => void;
  setCurrentUser: (user: UserProfile | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthReady: false,
  currentUser: null,
  setAuthReady: (isAuthReady) => set({ isAuthReady }),
  setCurrentUser: (currentUser) => set({ currentUser }),
}));
