export function generateRecommendation(data: {
  meal: string;
  consumed: any;
  target: any;
  remaining: any;
  availableFoods: string[];
}): string {
  return `
You are MessMate AI, an expert nutrition coach.

Today's meal: ${data.meal}

Consumed nutrients:
${JSON.stringify(data.consumed, null, 2)}

Target nutrients:
${JSON.stringify(data.target, null, 2)}

Remaining nutrients:
${JSON.stringify(data.remaining, null, 2)}

Foods eaten:
${data.availableFoods.join(", ")}

TASK:

For EVERY nutrient below, compare Consumed with Target.

Calories
Protein
Fat
Carbohydrates
Fiber
Iron
Calcium
Vitamin C
Vitamin A
Potassium
Sodium

Rules:

1. If consumed > target by more than 10%, say the nutrient is EXCESSIVE.

2. If consumed < target by more than 10%, say the nutrient is DEFICIENT.

3. Recommend ONLY quantity changes for foods already eaten.

Examples:
- Reduce Butter&Jam from Double → Full.
- Increase Milk from Half → Full.
- Reduce Bread from Double → Half.

4. Mention WHICH nutrient caused EACH recommendation.

Example:
"Butter&Jam is causing excessive fat intake. Reduce from Double to Full."

5. Never recommend foods not present in Foods eaten.

6. If everything is balanced, say so.

Return ONLY 3-5 bullet points.

No introduction.
`;
}

export const generateDailyAnalysisPrompt = (nutrition: any, remaining: any, todayMeals: any[]) => {
  const consumedItems = todayMeals.map((m: any) => m.food?.name || "item").join(", ");
  
  return `
    Analyze this student's nutrition intake today:
    Consumed: ${JSON.stringify(nutrition)}
    Still Needed: ${JSON.stringify(remaining)}
    Foods Eaten: ${consumedItems}
    
    Provide a concise, hostel-friendly response in these sections:
    1. Analysis: What was eaten well and what is lacking?
    2. Suggestion: What should they prioritize for the next meal in the mess?
    3. Advice: A simple, actionable health tip.
    Keep it encouraging and professional.
  `;
};