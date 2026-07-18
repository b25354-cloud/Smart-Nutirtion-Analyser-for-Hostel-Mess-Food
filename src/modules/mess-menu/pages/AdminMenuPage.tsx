import { useState } from "react";

type MealType = "breakfast" | "lunch" | "dinner";

export default function AdminMenuPage() {
  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [menu, setMenu] = useState({
    breakfast: [] as string[],
    lunch: [] as string[],
    dinner: [] as string[],
  });

  const addFood = (meal: MealType) => {
    const food = prompt(`Enter food for ${meal}`);
    if (!food?.trim()) return;

    setMenu((prev) => ({
      ...prev,
      [meal]: [...prev[meal], food.trim()],
    }));
  };

  const removeFood = (meal: MealType, index: number) => {
    setMenu((prev) => ({
      ...prev,
      [meal]: prev[meal].filter((_, i) => i !== index),
    }));
  };

  const saveMenu = () => {
    console.log({
      date,
      menu,
    });

    alert("Menu ready to save.");
  };

  const renderMeal = (meal: MealType, title: string, emoji: string) => (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          {emoji} {title}
        </h2>

        <button
          onClick={() => addFood(meal)}
          className="rounded-lg bg-blue-600 px-3 py-2 text-white hover:bg-blue-700"
        >
          + Add Food
        </button>
      </div>

      <div className="space-y-2">
        {menu[meal].length === 0 && (
          <p className="text-gray-500">
            No food added.
          </p>
        )}

        {menu[meal].map((food, index) => (
          <div
            key={index}
            className="flex items-center justify-between rounded-lg border p-3"
          >
            <span>{food}</span>

            <button
              onClick={() => removeFood(meal, index)}
              className="text-red-500"
            >
              🗑
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="mx-auto max-w-5xl p-8">
      <h1 className="mb-6 text-3xl font-bold">
        🍽 Admin Menu Manager
      </h1>

      <div className="mb-8">
        <label className="mb-2 block font-medium">
          Date
        </label>

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="rounded-lg border p-2"
        />
      </div>

      <div className="space-y-6">
        {renderMeal("breakfast", "Breakfast", "🍳")}
        {renderMeal("lunch", "Lunch", "🍛")}
        {renderMeal("dinner", "Dinner", "🌙")}
      </div>

      <div className="mt-8">
        <button
          onClick={saveMenu}
          className="rounded-xl bg-green-600 px-6 py-3 text-white hover:bg-green-700"
        >
          💾 Save Menu
        </button>
      </div>
    </div>
  );
}