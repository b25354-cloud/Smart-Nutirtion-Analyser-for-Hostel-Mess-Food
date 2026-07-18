import { useEffect, useState } from "react";

import { getTodaysMeals } from "@/services/dashboardService";
import { calculateDailyNutrition } from "@/utils/dashboardCalculator";
import {
  calculateRemainingNutrition,
  calculateNutritionScore,
} from "@/utils/nutritionCalculator";
import { getDailyTarget } from "@/utils/targetParser";

import StatCard from "@/modules/dashboard/components/StatCard";
import NutritionRing from "@/modules/dashboard/components/NutritionRing";
import ProgressBar from "@/modules/dashboard/components/ProgressBar";
import MealTimeline from "@/modules/dashboard/components/MealTimeline";
import AlertCard from "@/modules/dashboard/components/AlertCard";
import AIInsightCard from "@/modules/dashboard/components/AIInsightCard";

export default function StudentDashboardPage() {
  const [loading, setLoading] = useState(true);

  const [logs, setLogs] = useState<any[]>([]);

  const [nutrition, setNutrition] = useState<any>(null);

  const [remaining, setRemaining] = useState<any>(null);

  const [score, setScore] = useState(0);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    const todayLogs = await getTodaysMeals();

    setLogs(todayLogs);

    const totals = calculateDailyNutrition(todayLogs);

    setNutrition(totals);

    const target = getDailyTarget();

    setRemaining(
      calculateRemainingNutrition(target, totals)
    );

    setScore(
      calculateNutritionScore(
        totals,
        target
      )
    );

    setLoading(false);
  }

  if (loading)
    return (
      <div className="p-8">
        Loading Dashboard...
      </div>
    );

  const mealCount = logs.length;

  return (
    <div className="max-w-7xl mx-auto p-8 space-y-8">

      <div>

        <h1 className="text-4xl font-bold">
          📊 Dashboard
        </h1>

        <p className="text-gray-500 mt-2">
          Your nutrition summary for today
        </p>

      </div>

      <div className="grid md:grid-cols-4 gap-5">

        <StatCard
            title="Nutrition Score"
            value={`${score}/100`}
            emoji="🏆"
            color="green"
        />

        <StatCard
            title="Calories"
            value={`${nutrition?.calories.toFixed(0)} kcal`}
            emoji="🔥"
            color="yellow"
        />

        <StatCard
            title="Protein"
            value={`${nutrition?.protein.toFixed(1)} g`}
            emoji="💪"
            color="purple"
        />

        <StatCard
            title="Meals Logged"
            value={`${mealCount}/3`}
            emoji="🍽"
            color="blue"
        />

      </div>

      <div className="grid lg:grid-cols-3 gap-6">

        <NutritionRing score={score} />

        <AlertCard
          nutrition={nutrition}
          remaining={remaining}
        />

        <MealTimeline
          meals={logs}
        />

      </div>

      <div className="rounded-xl border p-6">

        <h2 className="font-bold text-xl mb-5">
          Today's Progress
        </h2>

        <ProgressBar
            label="Calories"
            current={nutrition.calories}
            target={2200}
            unit=" kcal"
        />

        <ProgressBar
            label="Protein"
            current={nutrition.protein}
            target={55}
            unit=" g"
        />

        <ProgressBar
            label="Fat"
            current={nutrition.fat}
            target={73}
            unit=" g"
        />

        <ProgressBar
            label="Carbohydrates"
            current={nutrition.carbs}
            target={304}
            unit=" g"
        />

        <ProgressBar
            label="Fiber"
            current={nutrition.fiber}
            target={25}
            unit=" g"
        />

        <ProgressBar
            label="Calcium"
            current={nutrition.calcium}
            target={1000}
            unit=" mg"
        />

        <ProgressBar
            label="Iron"
            current={nutrition.iron}
            target={14}
            unit=" mg"
        />

        <ProgressBar
            label="Vitamin C"
            current={nutrition.vitaminC}
            target={65}
            unit=" mg"
        />

        <ProgressBar
            label="Potassium"
            current={nutrition.potassium}
            target={3500}
            unit=" mg"
        />

        <ProgressBar
            label="Sodium"
            current={nutrition.sodium}
            target={2000}
            unit=" mg"
        />

      </div>

      <AIInsightCard
        score={score}
        nutrition={nutrition}
        remaining={remaining}
      />

    </div>
  );
}