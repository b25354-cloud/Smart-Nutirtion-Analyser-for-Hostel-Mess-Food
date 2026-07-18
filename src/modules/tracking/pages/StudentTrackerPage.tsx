import { useState } from "react";
import { getMealsByDayAndType } from "@/utils/menuParser";
import { getFoodByName } from "@/utils/foodParser";
import { calculateMealNutrition } from "@/utils/nutritionCalculator";
import { getMealTarget } from "@/utils/targetParser";
import { calculateRemainingNutrition } from "@/utils/nutritionCalculator";
import { calculateNutritionScore } from "@/utils/nutritionCalculator";
import { generateRecommendation } from "@/utils/aiRecommendation";
import { saveMeal } from "@/services/mealTrackerService";
import { geminiClient } from "@/services/gemini/client";
import { buildNutritionPrompt } from "@/services/gemini/nutritionPrompt";
import { getTodaysMeals } from "@/services/dashboardService";
import { calculateDailyNutrition } from "@/utils/dashboardCalculator";
import { getDailyTarget } from "@/utils/targetParser";

const servingOptions = [
  { label: "Skip", value: 0 },
  { label: "Half", value: 0.5 },
  { label: "Full", value: 1 },
  { label: "1.5x", value: 1.5 },
  { label: "Double", value: 2 },
];

export default function StudentTrackerPage() {
  const [day, setDay] = useState("Today");

  type MealType = "Breakfast" | "Lunch" | "Dinner";

  const [meal, setMeal] = useState<MealType>("Breakfast");

  const [skipMeal, setSkipMeal] = useState(false);

  const [servings, setServings] = useState<Record<string, number>>({});

  const [mealNutrition, setMealNutrition] = useState<any>(null);
  
  const [remainingNutrition, setRemainingNutrition] = useState<any>(null);

  const [nutritionScore, setNutritionScore] = useState<number | null>(null);

  const [targetNutrition, setTargetNutrition] = useState<any>(null);

  const [recommendations, setRecommendations] = useState<string[]>([]);

  const [dailyNutrition, setDailyNutrition] = useState<any>(null);

  const [dailyRemaining, setDailyRemaining] = useState<any>(null);

  const [dailyScore, setDailyScore] = useState<number | null>(null);

  const [todayMeals, setTodayMeals] = useState<any[]>([]);

  console.log(getFoodByName("Milk"));
  console.log(getFoodByName("Rajma"));

  return (
    <div className="max-w-5xl mx-auto p-8">

      <h1 className="text-3xl font-bold mb-8">
        🍽 Student Meal Tracker
      </h1>

      <div className="grid grid-cols-2 gap-6 mb-8">

        {/* Day Selection */}
        <div>
          <label className="block mb-2 font-medium">
            Day
          </label>

          <select
            className="w-full rounded-lg border p-3"
            value={day}
            onChange={(e) => setDay(e.target.value)}
          >
            <option>Today</option>
            <option>Monday</option>
            <option>Tuesday</option>
            <option>Wednesday</option>
            <option>Thursday</option>
            <option>Friday</option>
            <option>Saturday</option>
            <option>Sunday</option>
          </select>
        </div>

        {/* Meal Selection */}
        <div>
          <label className="block mb-2 font-medium">
            Meal
          </label>

          <select
            className="w-full rounded-lg border p-3"
            value={meal}
            onChange={(e) =>
                setMeal(e.target.value as MealType)
            }
          >
            <option>Breakfast</option>
            <option>Lunch</option>
            <option>Dinner</option>
          </select>
        </div>

      </div>

      {/* Skip Meal Checkbox */}

      <div className="mb-6 flex items-center gap-3">
        <input
          type="checkbox"
          checked={skipMeal}
          onChange={() => setSkipMeal(!skipMeal)}
        />

        <label className="font-medium">
          Skip this entire meal
        </label>
      </div>

      {/* Food Cards */}

      <div className="space-y-4">

        {getMealsByDayAndType(
            day === "Today"
                ? new Date().toLocaleDateString("en-US", {
                    weekday: "long",
                  })
                : day,
            meal
        ).map((food) => (

          <div
            key={food}
            className="border rounded-xl p-4 flex justify-between items-center"
          >

            <div>

              <h3 className="font-semibold text-lg">
                🍽 {food}
              </h3>

              <p className="text-sm text-gray-500">
                Select quantity consumed
              </p>

            </div>

            <div className="flex gap-2 flex-wrap">

              {servingOptions.map((option) => (

                <button
                  key={option.label}
                  disabled={skipMeal}
                  onClick={() =>
                    setServings((prev) => ({
                      ...prev,
                      [food]: option.value,
                    }))
                  }
                  className={`px-3 py-2 rounded-lg border transition
                  ${
                    servings[food] === option.value
                      ? "bg-blue-600 text-white"
                      : "bg-white"
                  }
                  ${
                    skipMeal
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {option.label}
                </button>

              ))}

            </div>

          </div>

        ))}

      </div>

      {/* Selected Items */}

      <div className="mt-10 border rounded-xl p-5">

        <h2 className="text-xl font-semibold mb-4">
          Selected Items
        </h2>

        {Object.keys(servings).length === 0 ? (

          <p className="text-gray-500">
            No food selected yet.
          </p>

        ) : (

          <ul className="space-y-2">

            {Object.entries(servings).map(
              ([food, amount]) => (

                <li key={food}>

                  <strong>{food}</strong>

                  {" : "}

                  {
                    servingOptions.find(
                      (option) =>
                        option.value === amount
                    )?.label
                  }

                </li>

              )
            )}

          </ul>

        )}

      </div>

      {/* Bottom Buttons */}

      <div className="mt-10">
        <div className="flex gap-4 mb-8">

            <button className="border rounded-lg px-5 py-3 hover:bg-gray-100">
            + Add Outside Food
            </button>

            <button
                className="bg-blue-600 text-white rounded-lg px-5 py-3"
                onClick={async () => {
                    const selectedFoods = Object.entries(servings)
                    .filter(([, serving]) => serving > 0)
                    .map(([foodName, serving]) => {
                        const food = getFoodByName(foodName);

                        if (!food) return null;

                        return {
                        food,
                        serving,
                        };
                    })
                    .filter(Boolean);

                    const totals = calculateMealNutrition(selectedFoods as any);
                    const target = getMealTarget(meal);
                    setTargetNutrition(target);

                    if (target) {
                    const remaining = calculateRemainingNutrition(target, totals);
                    console.log("TARGET:", target);
                    console.log("TOTALS:", totals);
                    const score = calculateNutritionScore(totals, target);
                    setNutritionScore(score);
                    const prompt = buildNutritionPrompt({
                        meal,
                        consumed: totals,
                        target,
                        remaining,
                        availableFoods: selectedFoods.map(
                            (f: any) => ({
                                food: f.food.name,
                                quantity: f.serving,
                            })
                            ),
                        });
                        const ai = await geminiClient.generateText({ prompt });
                        console.log(ai);
                        if (ai.ok) {
                        setRecommendations(
                            ai.data.text
                            .split("\n")
                            .filter((x) => x.trim() !== "")
                        );
                        } else {
                            const fallbackPrompt = generateRecommendation({
                                meal,
                                consumed: totals,
                                target,
                                remaining,
                                availableFoods: selectedFoods.map((f: any) => f.food.name),
                            });

                            setRecommendations([fallbackPrompt]);
                            }
                    await saveMeal({
                        day,
                        meal,
                        items: selectedFoods,
                        nutrition: totals,
                        remaining,
                        score,
                        });
                    const logs = await getTodaysMeals();

                        setTodayMeals(logs);

                        const total = calculateDailyNutrition(logs);

                        setDailyNutrition(total);

                        const dailyTarget = getDailyTarget();

                        const remainingToday = calculateRemainingNutrition(
                        dailyTarget,
                        total
                        );

                        setDailyRemaining(remainingToday);

                        const scoreToday = calculateNutritionScore(
                        total,
                        dailyTarget
                        );

                    setDailyScore(scoreToday);    
                    setMealNutrition(totals);
                    setRemainingNutrition(remaining);
                    }

                    console.log(totals);
                }}
                >
                Continue →
            </button>
        </div>
        {nutritionScore !== null && (
            <div className="mb-4 rounded-lg border p-4 text-center">
                <h3 className="text-lg font-semibold">Nutrition Score</h3>
                <p
                    className={`text-3xl font-bold ${
                        nutritionScore >= 90
                        ? "text-green-600"
                        : nutritionScore >= 75
                        ? "text-lime-600"
                        : nutritionScore >= 60
                        ? "text-yellow-600"
                        : nutritionScore >= 40
                        ? "text-orange-600"
                        : "text-red-600"
                    }`}
                    >
                    {nutritionScore}/100
                </p>
            </div>
            )}

        {mealNutrition && (
            <div className="mt-6 rounded-lg border p-4">
                <h3 className="font-semibold mb-3">Nutrition Summary</h3>

                <p>Calories: {mealNutrition.calories.toFixed(1)} kcal</p>
                <p>Protein: {mealNutrition.protein.toFixed(1)} g</p>
                <p>Fat: {mealNutrition.fat.toFixed(1)} g</p>
                <p>Carbs: {mealNutrition.carbs.toFixed(1)} g</p>
                <p>Fiber: {mealNutrition.fiber.toFixed(1)} g</p>
                <p>Iron: {mealNutrition.iron.toFixed(1)} mg</p>
                <p>Calcium: {mealNutrition.calcium.toFixed(1)} mg</p>
                <p>Vitamin C: {mealNutrition.vitaminC.toFixed(1)} mg</p>
                <p>Vitamin A: {mealNutrition.vitaminA.toFixed(1)} µg</p>
                <p>Potassium: {mealNutrition.potassium.toFixed(1)} mg</p>
                <p>Sodium: {mealNutrition.sodium.toFixed(1)} mg</p>
            </div>
            )}

        {targetNutrition && (
            <div className="mt-4 rounded-lg border p-4">
                <h3 className="font-semibold mb-3">Meal Target</h3>

                <p>Calories: {(targetNutrition.calories ?? 0).toFixed(1)} kcal</p>
                <p>Protein: {(targetNutrition.protein ?? 0).toFixed(1)} g</p>
                <p>Fat: {(targetNutrition.fat ?? 0).toFixed(1)} g</p>
                <p>Carbs: {(targetNutrition.carbohydrates ?? 0).toFixed(1)} g</p>
                <p>Fiber: {(targetNutrition.fiber ?? 0).toFixed(1)} g</p>
                <p>Iron: {(targetNutrition.iron ?? 0).toFixed(1)} mg</p>
                <p>Calcium: {(targetNutrition.calcium ?? 0).toFixed(1)} mg</p>
                <p>Vitamin C: {(targetNutrition.vitaminC ?? 0).toFixed(1)} mg</p>
                <p>Vitamin A: {(targetNutrition.vitaminA ?? 0).toFixed(1)} µg</p>
                <p>Potassium: {(targetNutrition.potassium ?? 0).toFixed(1)} mg</p>
                <p>Sodium: {(targetNutrition.sodium ?? 0).toFixed(1)} mg</p>
            </div>
            )}

        {remainingNutrition && (
            <div className="mt-4 rounded-lg border p-4">
                <h3 className="font-semibold mb-3">Remaining</h3>

                <p
                    className={
                        remainingNutrition.calories < 0
                        ? "text-red-600 font-semibold"
                        : "text-green-600"
                    }
                >Calories: {(remainingNutrition.calories ?? 0).toFixed(1)} kcal</p>
                <p
                    className={
                        remainingNutrition.calories < 0
                        ? "text-red-600 font-semibold"
                        : "text-green-600"
                    }
                >Protein: {(remainingNutrition.protein ?? 0).toFixed(1)} g</p>
                <p
                    className={
                        remainingNutrition.calories < 0
                        ? "text-red-600 font-semibold"
                        : "text-green-600"
                    }
                >Fat: {(remainingNutrition.fat ?? 0).toFixed(1)} g</p>
                <p
                    className={
                        remainingNutrition.carbohydrates < 0
                        ? "text-red-600 font-semibold"
                        : "text-green-600"
                    }
                >Carbs: {(remainingNutrition.carbohydrates ?? 0).toFixed(1)} g</p>
                <p
                    className={
                        remainingNutrition.fiber < 0
                        ? "text-red-600 font-semibold"
                        : "text-green-600"
                    }
                >Fiber: {(remainingNutrition.fiber ?? 0).toFixed(1)} g</p>
                <p
                    className={
                        remainingNutrition.iron < 0
                        ? "text-red-600 font-semibold"
                        : "text-green-600"
                    }
                >Iron: {(remainingNutrition.iron ?? 0).toFixed(1)} mg</p>
                <p
                    className={
                        remainingNutrition.calcium < 0
                        ? "text-red-600 font-semibold"
                        : "text-green-600"
                    }
                >Calcium: {(remainingNutrition.calcium ?? 0).toFixed(1)} mg</p>
                <p
                    className={
                        remainingNutrition.vitaminC < 0
                        ? "text-red-600 font-semibold"
                        : "text-green-600"
                    }
                >Vitamin C: {(remainingNutrition.vitaminC ?? 0).toFixed(1)} mg</p>
                <p
                    className={
                        remainingNutrition.vitaminA < 0
                        ? "text-red-600 font-semibold"
                        : "text-green-600"
                    }
                >Vitamin A: {(remainingNutrition.vitaminA ?? 0).toFixed(1)} µg</p>
                <p
                    className={
                        remainingNutrition.potassium < 0
                        ? "text-red-600 font-semibold"
                        : "text-green-600"
                    }
                >Potassium: {(remainingNutrition.potassium ?? 0).toFixed(1)} mg</p>
                <p
                    className={
                        remainingNutrition.sodium < 0
                        ? "text-red-600 font-semibold"
                        : "text-green-600"
                    }
                >Sodium: {(remainingNutrition.sodium ?? 0).toFixed(1)} mg</p>
            </div>
            )}
        
        {recommendations.length > 0 && (
            <div className="mt-4 rounded-lg border p-4">
                <h3 className="font-semibold mb-2">Recommendations</h3>

                <ul className="list-disc pl-5">
                {recommendations.map((item, index) => (
                    <li key={index}>{item}</li>
                ))}
                </ul>
            </div>
        )}

        {dailyScore !== null && (
            <div className="mt-6 rounded-lg border p-4 text-center">
                <h3 className="text-lg font-semibold">
                Today's Nutrition Score
                </h3>

                <p
                className={`text-3xl font-bold ${
                    dailyScore >= 90
                    ? "text-green-600"
                    : dailyScore >= 75
                    ? "text-lime-600"
                    : dailyScore >= 60
                    ? "text-yellow-600"
                    : dailyScore >= 40
                    ? "text-orange-600"
                    : "text-red-600"
                }`}
                >
                {dailyScore}/100
                </p>
            </div>
        )}

        {dailyNutrition && (
            <div className="mt-4 rounded-lg border p-4">
                <h3 className="font-semibold mb-3">
                Today's Nutrition
                </h3>

                <p>Calories: {dailyNutrition.calories.toFixed(1)} kcal</p>
                <p>Protein: {dailyNutrition.protein.toFixed(1)} g</p>
                <p>Fat: {dailyNutrition.fat.toFixed(1)} g</p>
                <p>Carbs: {dailyNutrition.carbs.toFixed(1)} g</p>
                <p>Fiber: {dailyNutrition.fiber.toFixed(1)} g</p>
                <p>Iron: {dailyNutrition.iron.toFixed(1)} mg</p>
                <p>Calcium: {dailyNutrition.calcium.toFixed(1)} mg</p>
                <p>Vitamin C: {dailyNutrition.vitaminC.toFixed(1)} mg</p>
                <p>Vitamin A: {dailyNutrition.vitaminA.toFixed(1)} µg</p>
                <p>Potassium: {dailyNutrition.potassium.toFixed(1)} mg</p>
                <p>Sodium: {dailyNutrition.sodium.toFixed(1)} mg</p>
            </div>
        )}
        
        {dailyRemaining && (
            <div className="mt-4 rounded-lg border p-4">
                <h3 className="font-semibold mb-3">
                Remaining Today
                </h3>

                <p className={dailyRemaining.calories < 0 ? "text-red-600 font-semibold" : "text-green-600"}>
                Calories: {dailyRemaining.calories.toFixed(1)} kcal
                </p>

                <p className={dailyRemaining.protein < 0 ? "text-red-600 font-semibold" : "text-green-600"}>
                Protein: {dailyRemaining.protein.toFixed(1)} g
                </p>

                <p className={dailyRemaining.fat < 0 ? "text-red-600 font-semibold" : "text-green-600"}>
                Fat: {dailyRemaining.fat.toFixed(1)} g
                </p>

                <p className={dailyRemaining.carbohydrates < 0 ? "text-red-600 font-semibold" : "text-green-600"}>
                Carbs: {dailyRemaining.carbohydrates.toFixed(1)} g
                </p>

                <p className={dailyRemaining.fiber < 0 ? "text-red-600 font-semibold" : "text-green-600"}>
                Fiber: {dailyRemaining.fiber.toFixed(1)} g
                </p>

                <p className={dailyRemaining.iron < 0 ? "text-red-600 font-semibold" : "text-green-600"}>
                Iron: {dailyRemaining.iron.toFixed(1)} mg
                </p>

                <p className={dailyRemaining.calcium < 0 ? "text-red-600 font-semibold" : "text-green-600"}>
                Calcium: {dailyRemaining.calcium.toFixed(1)} mg
                </p>

                <p className={dailyRemaining.vitaminC < 0 ? "text-red-600 font-semibold" : "text-green-600"}>
                Vitamin C: {dailyRemaining.vitaminC.toFixed(1)} mg
                </p>

                <p className={dailyRemaining.vitaminA < 0 ? "text-red-600 font-semibold" : "text-green-600"}>
                Vitamin A: {dailyRemaining.vitaminA.toFixed(1)} µg
                </p>

                <p className={dailyRemaining.potassium < 0 ? "text-red-600 font-semibold" : "text-green-600"}>
                Potassium: {dailyRemaining.potassium.toFixed(1)} mg
                </p>

                <p className={dailyRemaining.sodium < 0 ? "text-red-600 font-semibold" : "text-green-600"}>
                Sodium: {dailyRemaining.sodium.toFixed(1)} mg
                </p>
            </div>
        )}

        {todayMeals.length > 0 && (
            <div className="mt-4 rounded-lg border p-4">
                <h3 className="font-semibold mb-3">
                Today's Logged Meals
                </h3>

                <ul className="space-y-2">
                {todayMeals.map((meal: any) => (
                    <li key={meal.id}>
                    ✅ {meal.meal}
                    </li>
                ))}
                </ul>
            </div>
        )}


      </div>

    </div>
  );
}