import { create } from 'zustand';

import type { ThemeMode } from '@/types/ui';

interface UIState {
  isSidebarOpen: boolean;
  theme: ThemeMode;
  setSidebarOpen: (isOpen: boolean) => void;
  setTheme: (theme: ThemeMode) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isSidebarOpen: true,
  theme: 'light',
  setSidebarOpen: (isSidebarOpen) => set({ isSidebarOpen }),
  setTheme: (theme) => set({ theme }),
}));
