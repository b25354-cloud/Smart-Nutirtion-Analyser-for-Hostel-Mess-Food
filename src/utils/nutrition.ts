import type { NutrientProfile } from '@/types';

const ZERO_NUTRIENTS: NutrientProfile = {
  calories: 0,
  proteinG: 0,
  carbsG: 0,
  fatG: 0,
  fiberG: 0,
  ironMg: 0,
  calciumMg: 0,
  vitaminB12Mcg: 0,
};

export const aggregateNutrients = (profiles: NutrientProfile[]): NutrientProfile =>
  profiles.reduce(
    (acc, profile) => ({
      calories: acc.calories + profile.calories,
      proteinG: acc.proteinG + profile.proteinG,
      carbsG: acc.carbsG + profile.carbsG,
      fatG: acc.fatG + profile.fatG,
      fiberG: acc.fiberG + profile.fiberG,
      ironMg: acc.ironMg + profile.ironMg,
      calciumMg: acc.calciumMg + profile.calciumMg,
      vitaminB12Mcg: acc.vitaminB12Mcg + profile.vitaminB12Mcg,
    }),
    ZERO_NUTRIENTS,
  );
