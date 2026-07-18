import { useState } from "react";
import { getMealsByDayAndType } from "@/utils/menuParser";

const servingOptions = [
  { label: "Skip", value: 0 },
  { label: "Half", value: 0.5 },
  { label: "Full", value: 1 },
  { label: "1.5x", value: 1.5 },
  { label: "Double", value: 2 },
];

export default function StudentTrackerPage() {
  const [day, setDay] = useState("Today");

  const [meal, setMeal] =
  useState<"Breakfast" | "Lunch" | "Dinner">("Breakfast");

  const [skipMeal, setSkipMeal] = useState(false);

  const [servings, setServings] = useState<Record<string, number>>({});

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
              setMeal(
                e.target.value as keyof typeof dummyMenu
              )
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

      <div className="mt-10 flex gap-4">

        <button className="border rounded-lg px-5 py-3 hover:bg-gray-100">
          + Add Outside Food
        </button>

        <button className="bg-blue-600 text-white rounded-lg px-5 py-3 hover:bg-blue-700">
          Continue →
        </button>

      </div>

    </div>
  );
}