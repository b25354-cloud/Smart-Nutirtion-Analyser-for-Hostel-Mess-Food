import type { DailyNutritionSummary, Suggestion } from '@/types';

export const buildInsightPrompt = (summary: DailyNutritionSummary): string => `
You are MessMate AI, a nutrition coach for hostel students.
Explain nutrition performance in simple terms.
Keep suggestions realistic and affordable.
Daily summary JSON:
${JSON.stringify(summary, null, 2)}
`;

export const parseSuggestionsFallback = (): Suggestion[] => [
  {
    id: 'fallback-1',
    title: 'No AI suggestions generated',
    reasoning: 'Fallback suggestion used when Gemini response parsing fails.',
    affordabilityRank: 99,
  },
];
