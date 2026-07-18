import { useAuthStore } from '@/app/store';

export const useAuthContext = () => {
  return useAuthStore();
};