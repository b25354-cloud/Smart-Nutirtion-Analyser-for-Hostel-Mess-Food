import { create } from 'zustand';

interface CollegeContextState {
  selectedCollegeCode: string | null;
  selectedMessId: string | null;
  setSelectedCollegeCode: (collegeCode: string) => void;
  setSelectedMessId: (messId: string) => void;
}

export const useCollegeStore = create<CollegeContextState>((set) => ({
  selectedCollegeCode: null,
  selectedMessId: null,
  setSelectedCollegeCode: (selectedCollegeCode) => set({ selectedCollegeCode }),
  setSelectedMessId: (selectedMessId) => set({ selectedMessId }),
}));
