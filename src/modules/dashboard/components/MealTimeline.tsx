interface MealTimelineProps {
  meals: {
    meal?: string;
    mealType?: string;
    calories?: number;
  }[];
}

const mealConfig = [
  {
    key: "Breakfast",
    emoji: "🍳",
    color: "bg-yellow-100 text-yellow-700 border-yellow-300",
  },
  {
    key: "Lunch",
    emoji: "🍛",
    color: "bg-green-100 text-green-700 border-green-300",
  },
  {
    key: "Dinner",
    emoji: "🌙",
    color: "bg-blue-100 text-blue-700 border-blue-300",
  },
];

export default function MealTimeline({
  meals,
}: MealTimelineProps) {
  return (
    <div className="rounded-2xl border bg-white shadow-md p-6">

      <h2 className="text-xl font-bold mb-6">
        🍽 Today's Meals
      </h2>

      <div className="space-y-5">

        {mealConfig.map((mealItem, index) => {

          // Robust check: Looks for meal OR mealType safely
          const loggedMeal = meals.find(
            (m) =>
              (m.meal || m.mealType || "").toLowerCase() ===
              mealItem.key.toLowerCase()
          );

          const completed = !!loggedMeal;

          return (
            <div
              key={mealItem.key}
              className="flex items-start"
            >

              <div className="flex flex-col items-center mr-4">

                <div
                  className={`w-12 h-12 rounded-full border flex items-center justify-center text-xl ${
                    completed
                      ? mealItem.color
                      : "bg-gray-100 border-gray-300 text-gray-400"
                  }`}
                >
                  {mealItem.emoji}
                </div>

                {index !== mealConfig.length - 1 && (
                  <div
                    className={`w-1 h-14 mt-2 rounded-full ${
                      completed
                        ? "bg-green-400"
                        : "bg-gray-300"
                    }`}
                  />
                )}

              </div>

              <div className="flex-1">

                <div className="flex justify-between items-center">

                  <h3 className="font-semibold text-lg">
                    {mealItem.key}
                  </h3>

                  {completed ? (
                    <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-semibold">
                      ✓ Logged
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-500 text-sm">
                      Pending
                    </span>
                  )}

                </div>

                {completed ? (
                  <div className="mt-2 text-sm text-gray-600">

                    Calories:{" "}
                    <span className="font-semibold">
                      {loggedMeal.calories?.toFixed(0) ?? 0} kcal
                    </span>

                  </div>
                ) : (
                  <div className="mt-2 text-sm text-gray-400">
                    Meal not logged yet.
                  </div>
                )}

              </div>

            </div>
          );
        })}

      </div>

      <div className="mt-8">

        <div className="w-full bg-gray-200 rounded-full h-3">

          <div
            className="bg-green-500 h-3 rounded-full transition-all duration-700"
            style={{
              width: `${
                (meals.length > 0 ? new Set(meals.map(m => m.meal || m.mealType)).size : 0 / mealConfig.length) * 100
              }%`,
            }}
          />

        </div>

        <div className="mt-2 text-center text-sm text-gray-500">
          {meals.length > 0 ? new Set(meals.map(m => m.meal || m.mealType)).size : 0} of {mealConfig.length} meals logged today
        </div>

      </div>

    </div>
  );
}