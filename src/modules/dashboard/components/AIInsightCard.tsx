import { useEffect, useState } from "react";

interface Nutrition {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  fiber: number;
  calcium: number;
  iron: number;
  vitaminC: number;
  potassium: number;
  sodium: number;
}

interface Remaining {
  calories: number;
  protein: number;
  fat: number;
  carbohydrates: number;
  fiber: number;
  calcium: number;
  iron: number;
  vitaminC: number;
  potassium: number;
  sodium: number;
}

interface Props {
  score: number;
  nutrition: Nutrition;
  remaining: Remaining;
}

export default function AIInsightCard({
  score,
  nutrition,
  remaining,
}: Props) {
  const [loading, setLoading] = useState(true);
  const [advice, setAdvice] = useState("");

  useEffect(() => {
    generateInsights();
  }, []);

  function generateInsights() {
    setLoading(true);

    const suggestions: string[] = [];

    if (remaining.protein > 15) {
      suggestions.push(
        "Increase protein intake with dal, paneer, eggs or soy products."
      );
    }

    if (remaining.fiber > 8) {
      suggestions.push(
        "Include more fruits, salads and green vegetables to improve fiber intake."
      );
    }

    if (nutrition.sodium > 2000) {
      suggestions.push(
        "Your sodium intake is high. Reduce packaged foods and salty snacks."
      );
    }

    if (remaining.calcium > 250) {
      suggestions.push(
        "Milk, curd or paneer can help achieve today's calcium target."
      );
    }

    if (nutrition.calories < 1600) {
      suggestions.push(
        "Your calorie intake is relatively low. Consider a balanced evening meal."
      );
    }

    if (score >= 85) {
      suggestions.unshift(
        "Excellent work! Your meals today are nutritionally well balanced."
      );
    } else if (score >= 70) {
      suggestions.unshift(
        "Good progress! A few small dietary improvements can significantly improve today's nutrition."
      );
    } else {
      suggestions.unshift(
        "Today's nutrition can be improved. Focus on completing the remaining nutrient targets."
      );
    }

    if (suggestions.length === 1) {
      suggestions.push(
        "Keep following a balanced diet rich in fruits, vegetables and proteins."
      );
    }

    setTimeout(() => {
      setAdvice(suggestions.join("\n\n"));
      setLoading(false);
    }, 700);
  }

  return (
    <div className="rounded-2xl border bg-white shadow-md p-6">

      <div className="flex items-center justify-between">

        <div>

          <h2 className="text-2xl font-bold">
            🤖 AI Nutrition Coach
          </h2>

          <p className="text-gray-500 mt-1">
            Personalized recommendations based on today's nutrition.
          </p>

        </div>

        <div className="text-5xl">
          🧠
        </div>

      </div>

      {loading ? (

        <div className="py-12">

          <div className="animate-pulse space-y-4">

            <div className="h-4 bg-gray-200 rounded w-3/4" />

            <div className="h-4 bg-gray-200 rounded w-full" />

            <div className="h-4 bg-gray-200 rounded w-5/6" />

            <div className="h-4 bg-gray-200 rounded w-2/3" />

          </div>

          <p className="text-center mt-6 text-gray-500">
            AI is analyzing your meals...
          </p>

        </div>

      ) : (

        <div className="mt-8">

          {advice.split("\n\n").map((tip, index) => (

            <div
              key={index}
              className="flex gap-4 mb-5 p-4 rounded-xl bg-blue-50"
            >

              <div className="text-2xl">
                💡
              </div>

              <div className="text-gray-700 leading-relaxed">
                {tip}
              </div>

            </div>

          ))}

        </div>

      )}

      <div className="mt-6 border-t pt-4 flex justify-between text-sm text-gray-500">

        <span>
          Nutrition Score: <b>{score}/100</b>
        </span>

        <span>
          MessMate AI
        </span>

      </div>

    </div>
  );
}