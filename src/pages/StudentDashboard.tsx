import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getWeeklyMealLogs } from "@/services/firebase/tracking";
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
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  const [logs, setLogs] = useState<any[]>([]);
  const [nutrition, setNutrition] = useState<any>(null);
  const [remaining, setRemaining] = useState<any>(null);
  const [score, setScore] = useState(0);

  // Helper function to provide safe 0-values when no meals are tracked yet
  const getZeroNutrition = () => ({
    calories: 0, protein: 0, fat: 0, carbs: 0, fiber: 0, 
    calcium: 0, iron: 0, vitaminC: 0, potassium: 0, sodium: 0
  });

  useEffect(() => {
    if (user) {
      loadDashboard();
    } else {
      // If no user is detected, immediately stop loading and set to 0
      setNutrition(getZeroNutrition());
      setLoading(false);
    }
  }, [user]);

async function loadDashboard() {
  setLoading(true);

  try {
    // Fetch data from Firebase using the logged-in user's UID
    const weeklyResult = await getWeeklyMealLogs(user!.uid);
    const weeklyLogs: any[] = (weeklyResult.ok && weeklyResult.data) ? weeklyResult.data : [];

    // Find today's specific log
    const todayDate = new Date().toISOString().split('T')[0];
    const todayLog = weeklyLogs.find((log: any) => log.date === todayDate);

    // Extract meals or default to empty array
    const todayMeals = todayLog?.mealsConsumed || [];
    setLogs(todayMeals);
    
    console.log("DEBUG: Today's Log found:", todayLog);
    console.log("DEBUG: mealsConsumed array:", todayLog?.mealsConsumed);

    // Calculate totals by summing up all food items in the array
    const totals = todayMeals.length > 0 
      ? todayMeals.reduce((acc: any, item: any) => {
          // 'f' represents the food object
          const f = item.food || {}; 
          const s = item.serving || 1; 
          
          return {
            calories: acc.calories + ((f.calories || f.calories_kcal || 0) * s),
            protein: acc.protein + ((f.protein || f.protein_g || 0) * s),
            fat: acc.fat + ((f.fat || f.fat_g || 0) * s),
            carbs: acc.carbs + (((f.carbohydrates || f.carbohydrates_g || f.carbs || 0) * s)),
            fiber: acc.fiber + ((f.fiber || f.fiber_g || 0) * s),
            calcium: acc.calcium + ((f.calcium || f.calcium_mg || 0) * s),
            iron: acc.iron + ((f.iron || f.iron_mg || 0) * s),
            vitaminC: acc.vitaminC + ((f.vitaminC || f.vitaminC_mg || 0) * s),
            sodium: acc.sodium + ((f.sodium || f.sodium_mg || 0) * s),
            potassium: acc.potassium + ((f.potassium || f.potassium_mg || 0) * s),
          };
        }, getZeroNutrition())
      : getZeroNutrition();

    setNutrition(totals);

    // Calculate targets and scores based on the totals
    const target: any = getDailyTarget();
    setRemaining(calculateRemainingNutrition(target, totals));
    setScore(calculateNutritionScore(totals, target));

  } catch (error) {
    console.error("Dashboard failed to load from Firebase:", error);
    
    // Set safe defaults to prevent UI crashes
    const zeroTotals: any = getZeroNutrition();
    const target: any = getDailyTarget();
    
    setNutrition(zeroTotals);
    setRemaining(calculateRemainingNutrition(target, zeroTotals)); 
    setScore(0);
    setLogs([]); 
  } finally {
    // Guarantee the loading text disappears no matter what happens
    setLoading(false);
  }
}


  // If loading is true OR our objects haven't finished calculating yet, show the loading screen
  if (loading || !nutrition || !remaining)
    return (
      <div className="p-8 font-medium text-gray-500">
        Loading Dashboard...
      </div>
    );

 
  const uniqueMeals = Array.from(new Set(logs.map((item: any) => item.mealType || item.meal)));
  const mealCount = uniqueMeals.length;

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