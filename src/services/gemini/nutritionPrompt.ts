export function buildNutritionPrompt(data: {
  meal: string;
  consumed: any;
  remaining: any;
  availableFoods: {
  food: string;
  quantity: number;
  }[];
  target : any;
}) {
  return `
You are MessMate AI.

The student has just finished ${data.meal}.

Consumed Nutrition:
${JSON.stringify(data.consumed, null, 2)}

Remaining Nutrition:
${JSON.stringify(data.remaining, null, 2)}

Available Foods:
${data.availableFoods
  .map(f => `${f.food}: ${f.quantity} serving(s)`)
  .join("\n")}

Give exactly 3 practical suggestions.
Only recommend foods from the available foods list.
Maximum 60 words.
`;
}