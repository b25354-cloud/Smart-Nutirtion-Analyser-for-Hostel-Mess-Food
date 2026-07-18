import type { User } from 'firebase/auth';
import type { UserProfile } from '@/types';

export const mapFirebaseUserToProfile = (user: User): UserProfile => ({
  id: user.uid,
  email: user.email,
  displayName: user.displayName,
  instituteId: 'iit_mandi',
  role: 'student',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});