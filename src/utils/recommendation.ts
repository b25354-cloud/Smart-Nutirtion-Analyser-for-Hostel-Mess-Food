import type { Suggestion } from '@/types';

export const rankSuggestionsByAffordability = (suggestions: Suggestion[]): Suggestion[] =>
  [...suggestions].sort((a, b) => a.affordabilityRank - b.affordabilityRank);
