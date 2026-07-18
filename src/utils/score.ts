import type { NutritionGap, NutritionScore } from '@/types';

export const scoreFromGaps = (gaps: NutritionGap[]): NutritionScore => {
  const penalty = gaps.reduce((sum, gap) => sum + Math.max(0, gap.deficit), 0);
  const value = Math.max(0, Math.min(100, Math.round(100 - penalty)));

  if (value >= 90) return { value, grade: 'A' };
  if (value >= 75) return { value, grade: 'B' };
  if (value >= 60) return { value, grade: 'C' };
  if (value >= 45) return { value, grade: 'D' };
  return { value, grade: 'E' };
};
