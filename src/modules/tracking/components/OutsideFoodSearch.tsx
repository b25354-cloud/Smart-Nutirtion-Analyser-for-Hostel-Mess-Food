import { useState } from "react";
// Import your converted CSV data here
import outsideFoodData from "@/data/outsideFoods.json"; 

interface OutsideFoodSearchProps {
  onAddFood: (foodItem: any, serving: number) => void;
}

export default function OutsideFoodSearch({ onAddFood }: OutsideFoodSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [serving, setServing] = useState(1);
  const [selectedFood, setSelectedFood] = useState<any | null>(null);

  // Filter foods based on search
  const filteredFoods = searchTerm.length > 1
    ? outsideFoodData.filter((food: any) => 
        food.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (food.aliases && food.aliases.toLowerCase().includes(searchTerm.toLowerCase()))
      ).slice(0, 5) // Keep dropdown small
    : [];

  const handleAdd = () => {
    if (selectedFood) {
      onAddFood(selectedFood, serving);
      setSearchTerm("");
      setSelectedFood(null);
      setServing(1);
    }
  };

  return (
    <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100 shadow-sm space-y-4 mb-8">
      <h3 className="font-bold text-lg text-indigo-900">🍔 Search Outside Food</h3>
      
      <div className="relative">
        <input
          type="text"
          placeholder="Search for outside food (e.g., Dosa, Juice)..."
          className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
          value={selectedFood ? selectedFood.name : searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setSelectedFood(null);
          }}
        />

        {!selectedFood && filteredFoods.length > 0 && (
          <div className="absolute z-10 w-full mt-2 bg-white border rounded-xl shadow-lg overflow-hidden">
            {filteredFoods.map((food: any) => (
              <div
                key={food.food_id}
                onClick={() => setSelectedFood(food)}
                className="p-3 hover:bg-indigo-50 cursor-pointer border-b last:border-b-0 flex justify-between items-center"
              >
                <span className="font-medium text-gray-800">{food.name}</span>
                <span className="text-xs text-gray-500">{food.calories_kcal} kcal</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedFood && (
        <div className="flex items-center gap-4 bg-white p-4 rounded-xl border">
          <div className="flex-1">
            <p className="text-sm font-semibold text-indigo-900">{selectedFood.name}</p>
            <p className="text-xs text-indigo-700">{(selectedFood.calories_kcal * serving).toFixed(0)} kcal total</p>
          </div>
          
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="0.5"
              step="0.5"
              value={serving}
              onChange={(e) => setServing(Number(e.target.value))}
              className="w-16 p-2 border rounded-lg text-center"
            />
            <span className="text-sm text-gray-600">{selectedFood.serving_unit}(s)</span>
          </div>

          <button 
            onClick={handleAdd}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition-colors"
          >
            Add
          </button>
        </div>
      )}
    </div>
  );
}