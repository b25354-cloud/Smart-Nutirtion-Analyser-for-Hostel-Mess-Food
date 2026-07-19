import { useState, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { getMealsByDayAndType } from "@/utils/menuParser";
import { getFoodByName } from "@/utils/foodParser";
import { calculateMealNutrition, calculateRemainingNutrition, calculateNutritionScore } from "@/utils/nutritionCalculator";
import { getMealTarget, getDailyTarget } from "@/utils/targetParser";
import { generateRecommendation } from "@/utils/aiRecommendation";
import { saveDailyMealLog, getWeeklyMealLogs } from "@/services/firebase/tracking";
import { geminiClient } from "@/services/gemini/client";
import { buildNutritionPrompt } from "@/services/gemini/nutritionPrompt";
import { calculateDailyNutrition } from "@/utils/dashboardCalculator";
import OutsideFoodSearch from "@/modules/tracking/components/OutsideFoodSearch";
import outsideFoodData from "@/data/outsideFoods.json"; // NEW: Imported for AI to search outside foods

const servingOptions = [
  { label: "Skip", value: 0 },
  { label: "Half", value: 0.5 },
  { label: "Full", value: 1 },
  { label: "1.5x", value: 1.5 },
  { label: "Double", value: 2 },
];

export default function StudentTrackerPage() {
  const { user } = useAuth();
  const [day, setDay] = useState("Today");
  type MealType = "Breakfast" | "Lunch" | "Dinner";
  const [meal, setMeal] = useState<MealType>("Breakfast");
  const [skipMeal, setSkipMeal] = useState(false);
  const [servings, setServings] = useState<Record<string, number>>({});
  
  const [outsideFoods, setOutsideFoods] = useState<{food: any, serving: number}[]>([]);
  const [showOutsideSearch, setShowOutsideSearch] = useState(false);
  
  // NEW: State and Ref for AI Camera Feature
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [mealNutrition, setMealNutrition] = useState<any>(null);
  const [remainingNutrition, setRemainingNutrition] = useState<any>(null);
  const [nutritionScore, setNutritionScore] = useState<number | null>(null);
  const [targetNutrition, setTargetNutrition] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  
  const [dailyNutrition, setDailyNutrition] = useState<any>(null);
  const [dailyRemaining, setDailyRemaining] = useState<any>(null);
  const [dailyScore, setDailyScore] = useState<number | null>(null);
  const [todayMeals, setTodayMeals] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  // NEW: AI Vision Logic
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsAnalyzing(true);
      
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64Data = reader.result?.toString().split(",")[1];
        const prompt = "Identify the single main food item in this image. Return ONLY the food name in lowercase (e.g., 'masala dosa', 'pizza', 'apple'). Do not add any punctuation or extra words.";
        
        let detectedFood = ""; 
        try {
           // Calls your Gemini client. Ensure your client wrapper supports passing imageBase64!
           // Change lines 67-70 to this:
            const aiResult: any = await (geminiClient as any).generateText({
              prompt,
              imageBase64: base64Data
            });
           detectedFood = (aiResult as any).data.text.trim().toLowerCase();
        } catch(err) {
           console.error("Vision API error", err);
           alert("AI Vision failed. Make sure your geminiClient supports image inputs.");
           setIsAnalyzing(false);
           return;
        }

        // Search in Mess Menu first
        const currentMessFoods = getMealsByDayAndType(
          day === "Today" ? new Date().toLocaleDateString("en-US", { weekday: "long" }) : day,
          meal
        );

        const matchedMess = currentMessFoods.find(f => 
          f.toLowerCase().includes(detectedFood) || detectedFood.includes(f.toLowerCase())
        );

        if (matchedMess) {
          setServings(prev => ({ ...prev, [matchedMess]: 1 }));
          alert(`📸 AI Detected: ${matchedMess} (Added from Mess Menu)`);
        } else {
          // If not in Mess Menu, search in Outside Foods
          const matchedOutside = outsideFoodData.find((f: any) => 
            f.name.toLowerCase().includes(detectedFood) || 
            (f.aliases && f.aliases.toLowerCase().includes(detectedFood))
          );

          if (matchedOutside) {
            setOutsideFoods(prev => [...prev, { food: matchedOutside, serving: 1 }]);
            alert(`📸 AI Detected: ${matchedOutside.name} (Added from Outside Foods)`);
          } else {
            alert(`📸 AI Detected "${detectedFood}", but couldn't find a match in your menus. Please add it manually.`);
          }
        }
        setIsAnalyzing(false);
        // Reset file input so user can take another photo
        if (fileInputRef.current) fileInputRef.current.value = "";
      };
    } catch (error) {
      console.error("Error analyzing image:", error);
      alert("Failed to analyze image.");
      setIsAnalyzing(false);
    }
  };

  const handleSaveMeal = async () => {
    if (!user) {
      alert("You must be logged in to save meals.");
      return;
    }
    
    try {
      setIsSaving(true);

      const standardFoods = Object.entries(servings)
        .filter(([, serving]) => serving > 0)
        .map(([foodName, serving]) => {
          const food = getFoodByName(foodName);
          if (!food) return null;
          return { food, serving, mealType: meal };
        })
        .filter(Boolean);

      const allSelectedFoods = [
        ...standardFoods,
        ...outsideFoods.map(item => ({ food: item.food, serving: item.serving, mealType: meal }))
      ];

      if (allSelectedFoods.length === 0) {
        alert("Please select at least one food item.");
        setIsSaving(false);
        return;
      }

      const totals = calculateMealNutrition(allSelectedFoods as any);
      const target = getMealTarget(meal);
      setTargetNutrition(target);

      if (target) {
        const remaining = calculateRemainingNutrition(target, totals);
        const score = calculateNutritionScore(totals, target);
        setNutritionScore(score);

        try {
          const prompt = buildNutritionPrompt({
            meal,
            consumed: totals,
            target,
            remaining,
            availableFoods: allSelectedFoods.map((f: any) => ({
              food: f.food.name,
              quantity: f.serving,
            })),
          });

          const ai = await geminiClient.generateText({ prompt });
          if (ai.ok) {
            setRecommendations(ai.data.text.split("\n").filter((x: string) => x.trim() !== ""));
          } else {
            throw new Error("AI response failed");
          }
        } catch (aiError) {
          console.warn("Gemini AI failed, using local fallback recommendations.");
          const fallbackPrompt = generateRecommendation({
            meal,
            consumed: totals,
            target,
            remaining,
            availableFoods: allSelectedFoods.map((f: any) => f.food.name),
          });
          setRecommendations([fallbackPrompt]);
        }

        const todayDate = new Date().toISOString().split('T')[0];
        const weeklyResult = await getWeeklyMealLogs(user.uid);
        const existingLogs: any[] = weeklyResult?.data || [];
        const todayLog = existingLogs.find((log: any) => log.date === todayDate);
        
        const existingMealsConsumed = todayLog?.mealsConsumed || [];
        const combinedMeals = [...existingMealsConsumed, ...allSelectedFoods];
        
        const combinedTotals: any = calculateDailyNutrition(combinedMeals);

        await saveDailyMealLog(user.uid, todayDate, {
          mealsConsumed: combinedMeals,
          totalCalories: combinedTotals?.calories || 0,
          totalProtein: combinedTotals?.protein || 0,
          totalCarbs: combinedTotals?.carbs || combinedTotals?.carbohydrates || 0,
          totalFats: combinedTotals?.fat || 0
        });

        setTodayMeals(combinedMeals);
        setDailyNutrition(combinedTotals);
        
        setServings({});
        setOutsideFoods([]);
        setShowOutsideSearch(false);

        const dailyTarget = getDailyTarget();
        const remainingToday = calculateRemainingNutrition(dailyTarget, combinedTotals);
        setDailyRemaining(remainingToday);

        const scoreToday = calculateNutritionScore(combinedTotals, dailyTarget);
        setDailyScore(scoreToday);

        setMealNutrition(totals);
        setRemainingNutrition(remaining);
      }
    } catch (error) {
      console.error("Critical error saving meal:", error);
      alert("Failed to save meal. Check console for details.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">🍽 Student Meal Tracker</h1>

      <div className="grid grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block mb-2 font-medium">Day</label>
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

        <div>
          <label className="block mb-2 font-medium">Meal</label>
          <select
            className="w-full rounded-lg border p-3"
            value={meal}
            onChange={(e) => setMeal(e.target.value as MealType)}
          >
            <option>Breakfast</option>
            <option>Lunch</option>
            <option>Dinner</option>
          </select>
        </div>
      </div>

      <div className="mb-6 flex items-center gap-3">
        <input
          type="checkbox"
          checked={skipMeal}
          onChange={() => setSkipMeal(!skipMeal)}
        />
        <label className="font-medium">Skip this entire meal</label>
      </div>

      <div className="space-y-4 mb-10">
        {getMealsByDayAndType(
          day === "Today" ? new Date().toLocaleDateString("en-US", { weekday: "long" }) : day,
          meal
        ).map((food) => (
          <div key={food} className="border rounded-xl p-4 flex justify-between items-center bg-white shadow-sm">
            <div>
              <h3 className="font-semibold text-lg">🍽 {food}</h3>
              <p className="text-sm text-gray-500">Select quantity consumed</p>
            </div>
            <div className="flex gap-2 flex-wrap">
              {servingOptions.map((option) => (
                <button
                  key={option.label}
                  disabled={skipMeal}
                  onClick={() => setServings((prev) => ({ ...prev, [food]: option.value }))}
                  className={`px-3 py-2 rounded-lg border transition ${
                    servings[food] === option.value ? "bg-blue-600 text-white" : "bg-white text-gray-700"
                  } ${skipMeal ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50"}`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {showOutsideSearch && (
        <div className="mt-8">
          <OutsideFoodSearch 
            onAddFood={(food, serving) => setOutsideFoods(prev => [...prev, { food, serving }])} 
          />
        </div>
      )}

      <div className="border rounded-xl p-5 bg-white mb-10 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Selected Items</h2>
        {Object.keys(servings).length === 0 && outsideFoods.length === 0 ? (
          <p className="text-gray-500">No food selected yet.</p>
        ) : (
          <ul className="space-y-3">
            {Object.entries(servings).map(([food, amount]) => (
              <li key={food} className="flex justify-between border-b pb-2">
                <span className="font-medium text-gray-800">{food}</span>
                <span className="text-gray-600 font-medium">{servingOptions.find((o) => o.value === amount)?.label}</span>
              </li>
            ))}
            
            {outsideFoods.map((item, idx) => (
              <li key={`outside-${idx}`} className="flex justify-between items-center border-b pb-2 text-indigo-700">
                <span className="font-medium flex items-center gap-2">
                  <span>🍔</span> {item.food.name} <span className="text-xs text-indigo-400 border border-indigo-200 px-2 py-0.5 rounded-full">Outside</span>
                </span>
                <span className="flex items-center gap-4">
                  <span className="font-medium">{item.serving} {item.food.serving_unit}</span>
                  <button 
                    onClick={() => setOutsideFoods(prev => prev.filter((_, i) => i !== idx))} 
                    className="text-red-500 hover:text-red-700 text-sm font-bold bg-red-50 px-2 py-1 rounded"
                  >
                    X
                  </button>
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Bottom Buttons - NEW CAMERA BUTTON ADDED HERE */}
      <div className="flex gap-4 mb-10">
        {/* Hidden File Input */}
        <input 
          type="file" 
          accept="image/*" 
          capture="environment" 
          ref={fileInputRef} 
          className="hidden" 
          onChange={handleImageUpload} 
        />
        
        {/* Camera Button */}
        <button 
          onClick={() => fileInputRef.current?.click()}
          disabled={isAnalyzing}
          className={`border-2 rounded-lg px-5 py-3 font-medium transition flex items-center gap-2 ${isAnalyzing ? 'bg-indigo-50 border-indigo-300 text-indigo-400 cursor-wait' : 'bg-white hover:bg-gray-50 border-indigo-200 text-indigo-700'}`}
        >
          {isAnalyzing ? '⏳ Scanning...' : '📸 Snap Photo'}
        </button>

        <button 
          onClick={() => setShowOutsideSearch(!showOutsideSearch)}
          className={`border-2 rounded-lg px-5 py-3 font-medium transition ${showOutsideSearch ? 'bg-indigo-50 border-indigo-600 text-indigo-700' : 'bg-white hover:bg-gray-50 border-gray-200'}`}
        >
          {showOutsideSearch ? 'Close Search' : '+ Add Outside Food'}
        </button>

        <button
            className={`bg-blue-600 text-white rounded-lg px-8 py-3 font-bold transition flex-1 ${isSaving ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'}`}
            onClick={handleSaveMeal}
            disabled={isSaving}
        >
            {isSaving ? 'Saving to Profile...' : 'Save Meal & Continue →'}
        </button>
      </div>

      {nutritionScore !== null && (
        <div className="mb-4 rounded-lg border p-4 text-center bg-white shadow-sm">
          <h3 className="text-lg font-semibold">Meal Score</h3>
          <p className={`text-3xl font-bold ${
            nutritionScore >= 90 ? "text-green-600" : nutritionScore >= 75 ? "text-lime-600" : nutritionScore >= 60 ? "text-yellow-600" : "text-red-600"
          }`}>
            {nutritionScore}/100
          </p>
        </div>
      )}

      {mealNutrition && (
        <div className="mt-6 rounded-lg border p-4 bg-white shadow-sm">
          <h3 className="font-semibold mb-3">Meal Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-3 text-sm">
            <p>Calories: {mealNutrition.calories.toFixed(1)} kcal</p>
            <p>Protein: {mealNutrition.protein.toFixed(1)} g</p>
            <p>Fat: {mealNutrition.fat.toFixed(1)} g</p>
            <p>Carbs: {(mealNutrition.carbs || mealNutrition.carbohydrates || 0).toFixed(1)} g</p>
            <p>Fiber: {mealNutrition.fiber.toFixed(1)} g</p>
            <p>Iron: {mealNutrition.iron.toFixed(1)} mg</p>
            <p>Calcium: {mealNutrition.calcium.toFixed(1)} mg</p>
            <p>Vitamin C: {mealNutrition.vitaminC.toFixed(1)} mg</p>
            <p>Vitamin A: {mealNutrition.vitaminA.toFixed(1)} µg</p>
            <p>Potassium: {mealNutrition.potassium.toFixed(1)} mg</p>
            <p>Sodium: {mealNutrition.sodium.toFixed(1)} mg</p>
          </div>
        </div>
      )}

      {targetNutrition && (
        <div className="mt-4 rounded-lg border p-4 bg-white">
          <h3 className="font-semibold mb-3">Meal Target</h3>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
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
        </div>
      )}

      {remainingNutrition && (
        <div className="mt-4 rounded-lg border p-4 bg-white">
          <h3 className="font-semibold mb-3">Remaining</h3>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <p className={remainingNutrition.calories < 0 ? "text-red-600 font-semibold" : "text-green-600"}>
              Calories: {(remainingNutrition.calories ?? 0).toFixed(1)} kcal
            </p>
            <p className={remainingNutrition.protein < 0 ? "text-red-600 font-semibold" : "text-green-600"}>
              Protein: {(remainingNutrition.protein ?? 0).toFixed(1)} g
            </p>
            <p className={remainingNutrition.fat < 0 ? "text-red-600 font-semibold" : "text-green-600"}>
              Fat: {(remainingNutrition.fat ?? 0).toFixed(1)} g
            </p>
            <p className={remainingNutrition.carbohydrates < 0 ? "text-red-600 font-semibold" : "text-green-600"}>
              Carbs: {(remainingNutrition.carbohydrates ?? 0).toFixed(1)} g
            </p>
            <p className={remainingNutrition.fiber < 0 ? "text-red-600 font-semibold" : "text-green-600"}>
              Fiber: {(remainingNutrition.fiber ?? 0).toFixed(1)} g
            </p>
            <p className={remainingNutrition.iron < 0 ? "text-red-600 font-semibold" : "text-green-600"}>
              Iron: {(remainingNutrition.iron ?? 0).toFixed(1)} mg
            </p>
            <p className={remainingNutrition.calcium < 0 ? "text-red-600 font-semibold" : "text-green-600"}>
              Calcium: {(remainingNutrition.calcium ?? 0).toFixed(1)} mg
            </p>
            <p className={remainingNutrition.vitaminC < 0 ? "text-red-600 font-semibold" : "text-green-600"}>
              Vitamin C: {(remainingNutrition.vitaminC ?? 0).toFixed(1)} mg
            </p>
            <p className={remainingNutrition.vitaminA < 0 ? "text-red-600 font-semibold" : "text-green-600"}>
              Vitamin A: {(remainingNutrition.vitaminA ?? 0).toFixed(1)} µg
            </p>
            <p className={remainingNutrition.potassium < 0 ? "text-red-600 font-semibold" : "text-green-600"}>
              Potassium: {(remainingNutrition.potassium ?? 0).toFixed(1)} mg
            </p>
            <p className={remainingNutrition.sodium < 0 ? "text-red-600 font-semibold" : "text-green-600"}>
              Sodium: {(remainingNutrition.sodium ?? 0).toFixed(1)} mg
            </p>
          </div>
        </div>
      )}

      {recommendations.length > 0 && (
        <div className="mt-4 rounded-lg border p-4 bg-blue-50">
          <h3 className="font-semibold mb-2 text-blue-900">AI Coach Recommendations</h3>
          <ul className="list-disc pl-5 space-y-1 text-blue-800 text-sm">
            {recommendations.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {dailyScore !== null && (
        <div className="mt-6 rounded-lg border p-4 text-center bg-white">
          <h3 className="text-lg font-semibold">Today's Nutrition Score</h3>
          <p className={`text-3xl font-bold ${
            dailyScore >= 90 ? "text-green-600" : dailyScore >= 75 ? "text-lime-600" : dailyScore >= 60 ? "text-yellow-600" : "text-red-600"
          }`}>
            {dailyScore}/100
          </p>
        </div>
      )}

      {dailyNutrition && (
        <div className="mt-4 rounded-lg border p-4 bg-white">
          <h3 className="font-semibold mb-3">Today's Nutrition</h3>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <p>Calories: {(dailyNutrition.calories ?? 0).toFixed(1)} kcal</p>
            <p>Protein: {(dailyNutrition.protein ?? 0).toFixed(1)} g</p>
            <p>Fat: {(dailyNutrition.fat ?? 0).toFixed(1)} g</p>
            <p>Carbs: {(dailyNutrition.carbs || dailyNutrition.carbohydrates || 0).toFixed(1)} g</p>
            <p>Fiber: {(dailyNutrition.fiber ?? 0).toFixed(1)} g</p>
            <p>Iron: {(dailyNutrition.iron ?? 0).toFixed(1)} mg</p>
            <p>Calcium: {(dailyNutrition.calcium ?? 0).toFixed(1)} mg</p>
            <p>Vitamin C: {(dailyNutrition.vitaminC ?? 0).toFixed(1)} mg</p>
            <p>Vitamin A: {(dailyNutrition.vitaminA ?? 0).toFixed(1)} µg</p>
            <p>Potassium: {(dailyNutrition.potassium ?? 0).toFixed(1)} mg</p>
            <p>Sodium: {(dailyNutrition.sodium ?? 0).toFixed(1)} mg</p>
          </div>
        </div>
      )}

      {dailyRemaining && (
        <div className="mt-4 rounded-lg border p-4 bg-white">
          <h3 className="font-semibold mb-3">Remaining Today</h3>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <p className={(dailyRemaining.calories ?? 0) < 0 ? "text-red-600 font-semibold" : "text-green-600"}>
              Calories: {(dailyRemaining.calories ?? 0).toFixed(1)} kcal
            </p>
            <p className={(dailyRemaining.protein ?? 0) < 0 ? "text-red-600 font-semibold" : "text-green-600"}>
              Protein: {(dailyRemaining.protein ?? 0).toFixed(1)} g
            </p>
            <p className={(dailyRemaining.fat ?? 0) < 0 ? "text-red-600 font-semibold" : "text-green-600"}>
              Fat: {(dailyRemaining.fat ?? 0).toFixed(1)} g
            </p>
            <p className={(dailyRemaining.carbohydrates ?? 0) < 0 ? "text-red-600 font-semibold" : "text-green-600"}>
              Carbs: {(dailyRemaining.carbohydrates ?? 0).toFixed(1)} g
            </p>
            <p className={(dailyRemaining.fiber ?? 0) < 0 ? "text-red-600 font-semibold" : "text-green-600"}>
              Fiber: {(dailyRemaining.fiber ?? 0).toFixed(1)} g
            </p>
            <p className={(dailyRemaining.iron ?? 0) < 0 ? "text-red-600 font-semibold" : "text-green-600"}>
              Iron: {(dailyRemaining.iron ?? 0).toFixed(1)} mg
            </p>
            <p className={(dailyRemaining.calcium ?? 0) < 0 ? "text-red-600 font-semibold" : "text-green-600"}>
              Calcium: {(dailyRemaining.calcium ?? 0).toFixed(1)} mg
            </p>
            <p className={(dailyRemaining.vitaminC ?? 0) < 0 ? "text-red-600 font-semibold" : "text-green-600"}>
              Vitamin C: {(dailyRemaining.vitaminC ?? 0).toFixed(1)} mg
            </p>
            <p className={(dailyRemaining.vitaminA ?? 0) < 0 ? "text-red-600 font-semibold" : "text-green-600"}>
              Vitamin A: {(dailyRemaining.vitaminA ?? 0).toFixed(1)} µg
            </p>
            <p className={(dailyRemaining.potassium ?? 0) < 0 ? "text-red-600 font-semibold" : "text-green-600"}>
              Potassium: {(dailyRemaining.potassium ?? 0).toFixed(1)} mg
            </p>
            <p className={(dailyRemaining.sodium ?? 0) < 0 ? "text-red-600 font-semibold" : "text-green-600"}>
              Sodium: {(dailyRemaining.sodium ?? 0).toFixed(1)} mg
            </p>
          </div>
        </div>
      )}

      {todayMeals.length > 0 && (
        <div className="mt-4 rounded-lg border p-4 bg-white">
          <h3 className="font-semibold mb-3">Today's Logged Meals</h3>
          <ul className="space-y-2">
            {todayMeals.map((mealItem: any, index: number) => (
              <li key={index} className="flex items-center">
                ✅ {mealItem.food?.name || mealItem.meal || 'Logged Item'}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}