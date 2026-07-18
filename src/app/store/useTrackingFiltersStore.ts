import { create } from 'zustand';

interface TrackingFiltersState {
  activeDate: string;
  activeWeekStart: string;
  mealTypeFilter: 'all' | 'breakfast' | 'lunch' | 'dinner';
  setActiveDate: (date: string) => void;
  setActiveWeekStart: (weekStart: string) => void;
  setMealTypeFilter: (mealType: TrackingFiltersState['mealTypeFilter']) => void;
}

export const useTrackingFiltersStore = create<TrackingFiltersState>((set) => ({
  activeDate: new Date().toISOString().slice(0, 10),
  activeWeekStart: new Date().toISOString().slice(0, 10),
  mealTypeFilter: 'all',
  setActiveDate: (activeDate) => set({ activeDate }),
  setActiveWeekStart: (activeWeekStart) => set({ activeWeekStart }),
  setMealTypeFilter: (mealTypeFilter) => set({ mealTypeFilter }),
}));
