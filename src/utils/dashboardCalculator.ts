export function calculateDailyNutrition(logs: any[]) {
  const total = {
    calories: 0,
    protein: 0,
    fat: 0,
    carbs: 0,
    fiber: 0,
    iron: 0,
    calcium: 0,
    vitaminC: 0,
    vitaminA: 0,
    potassium: 0,
    sodium: 0,
  };

  logs.forEach((log) => {
    const n = log.nutrition;

    if (!n) return;

    total.calories += n.calories ?? 0;
    total.protein += n.protein ?? 0;
    total.fat += n.fat ?? 0;
    total.carbs += n.carbs ?? 0;
    total.fiber += n.fiber ?? 0;
    total.iron += n.iron ?? 0;
    total.calcium += n.calcium ?? 0;
    total.vitaminC += n.vitaminC ?? 0;
    total.vitaminA += n.vitaminA ?? 0;
    total.potassium += n.potassium ?? 0;
    total.sodium += n.sodium ?? 0;
  });

  return total;
}