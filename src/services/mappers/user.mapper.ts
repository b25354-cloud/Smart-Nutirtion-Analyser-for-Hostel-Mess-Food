import type { User } from 'firebase/auth';

import type { UserProfile } from '@/types';

export const mapFirebaseUserToProfile = (user: User): UserProfile => ({
  uid: user.uid,
  email: user.email,
  displayName: user.displayName,
  collegeId: 'UNASSIGNED',
  role: 'student',
});
