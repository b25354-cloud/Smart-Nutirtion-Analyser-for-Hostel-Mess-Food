import { collection, getDocs, query, where } from 'firebase/firestore';

import { collectionNames } from '@/types/firestore';
import type { College, ServiceResult } from '@/types';
import { toServiceError } from '@/utils/error';
import { firestoreDb } from '@/services/firebase/firestore';

export const collegesRepository = {
  async listActiveColleges(): Promise<ServiceResult<College[]>> {
    try {
      const collegesQuery = query(collection(firestoreDb, collectionNames.colleges), where('active', '==', true));
      const snapshot = await getDocs(collegesQuery);

      return {
        ok: true,
        data: snapshot.docs.map((doc) => ({ id: doc.id, ...(doc.data() as Omit<College, 'id'>) })),
      };
    } catch (error) {
      return { ok: false, error: toServiceError(error, 'Unable to load colleges') };
    }
  },
};
