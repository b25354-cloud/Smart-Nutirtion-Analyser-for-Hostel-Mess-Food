import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { getWeeklyMealLogs } from "@/services/firebase/tracking";
import { format, addDays, subDays } from "date-fns";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { geminiClient } from "@/services/gemini/client";
import { generateDailyAnalysisPrompt } from "@/utils/aiRecommendation";

export default function DailyAnalysisPage() {
  const { user } = useAuth();
  const [date, setDate] = useState(new Date());
  const [data, setData] = useState<any>(null);
  const [insights, setInsights] = useState("Analyzing your day...");

  const fetchData = async () => {
    if (!user?.uid) return;
    const dateStr = format(date, 'yyyy-MM-dd');
    const result = await getWeeklyMealLogs(user.uid);
    const logsArray = Array.isArray(result.data) ? result.data : [];
    const log = logsArray.find((l: any) => l.date === dateStr);

    if (log) {
      // Calculate totals including micros
      const computed = log.mealsConsumed?.reduce((acc: any, item: any) => {
        const f = item.food || {};
        const s = item.serving || 1;
        return {
          calories: acc.calories + ((f.calories_kcal || 0) * s),
          protein: acc.protein + ((f.protein_g || 0) * s),
          carbs: acc.carbs + ((f.carbohydrates_g || f.carbs_g || 0) * s),
          fat: acc.fat + ((f.fat_g || 0) * s),
          fiber: acc.fiber + ((f.fiber_g || 0) * s),
          iron: acc.iron + ((f.iron_mg || 0) * s),
          calcium: acc.calcium + ((f.calcium_mg || 0) * s),
          vitaminC: acc.vitaminC + ((f.vitaminC_mg || 0) * s),
          vitaminA: acc.vitaminA + ((f.vitaminA_ug || 0) * s),
        };
      }, { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, iron: 0, calcium: 0, vitaminC: 0, vitaminA: 0 });

      setData({ ...log, computedTotals: computed });
      const prompt = generateDailyAnalysisPrompt(computed, {}, log.mealsConsumed);
      const ai = await geminiClient.generateText({ prompt });
      if (ai.ok) setInsights(ai.data.text);
    } else {
      setData(null);
      setInsights("No data found for this date.");
    }
  };

  useEffect(() => { fetchData(); }, [date, user]);

  const t = data?.computedTotals || { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, iron: 0, calcium: 0, vitaminC: 0, vitaminA: 0 };
  const pieData = [
    { name: 'Protein', value: t.protein * 4, color: '#6366f1' },
    { name: 'Fat', value: t.fat * 9, color: '#f59e0b' },
    { name: 'Carbs', value: t.carbs * 4, color: '#10b981' },
  ].filter(item => item.value > 0);

  // NEW FEATURE HELPERS: Getting meals and calories grouped by meal type
  const mealGroups = [
    { key: "Breakfast", icon: "🍳" },
    { key: "Lunch", icon: "🍛" },
    { key: "Dinner", icon: "🌙" }
  ];

  const getMealItems = (mType: string) => {
    return (data?.mealsConsumed || []).filter((m: any) => (m.mealType || m.meal || "").toLowerCase() === mType.toLowerCase());
  };

  const getMealCals = (mType: string) => {
    return getMealItems(mType).reduce((sum: number, m: any) => {
      const f = m.food || {};
      const s = m.serving || 1;
      return sum + ((f.calories_kcal || f.calories || 0) * s);
    }, 0);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-indigo-100">
        <button onClick={() => setDate(subDays(date, 1))} className="px-4 py-2 hover:bg-indigo-50 rounded-lg font-bold text-indigo-600">← Prev</button>
        <h1 className="text-xl font-bold text-indigo-900">{format(date, 'MMMM do, yyyy')}</h1>
        <button onClick={() => setDate(addDays(date, 1))} className="px-4 py-2 hover:bg-indigo-50 rounded-lg font-bold text-indigo-600">Next →</button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Calories" value={t.calories.toFixed(0)} unit="kcal" color="bg-indigo-500" />
            <StatCard label="Protein" value={t.protein.toFixed(1)} unit="g" color="bg-violet-500" />
            <StatCard label="Carbs" value={t.carbs.toFixed(1)} unit="g" color="bg-emerald-500" />
            <StatCard label="Fat" value={t.fat.toFixed(1)} unit="g" color="bg-amber-500" />
          </div>

          {/* Micro-Nutrient Grid */}
          <div className="grid md:grid-cols-3 gap-4">
            <MicroCard label="Fiber" val={t.fiber} target={25} unit="g" />
            <MicroCard label="Iron" val={t.iron} target={14} unit="mg" />
            <MicroCard label="Calcium" val={t.calcium} target={1000} unit="mg" />
            <MicroCard label="Vit C" val={t.vitaminC} target={90} unit="mg" />
            <MicroCard label="Vit A" val={t.vitaminA} target={900} unit="ug" />
          </div>

          <div className="bg-white p-6 rounded-2xl border border-indigo-50 shadow-sm h-64">
            <h3 className="font-bold text-indigo-900 mb-4">Macro Distribution</h3>
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart><Pie data={pieData} dataKey="value" innerRadius={50} outerRadius={70} paddingAngle={5}><Cell fill="#6366f1"/><Cell fill="#f59e0b"/><Cell fill="#10b981"/></Pie><Tooltip /></PieChart>
              </ResponsiveContainer>
            ) : <p className="text-gray-400 text-center mt-10">No intake data.</p>}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-indigo-50 shadow-sm">
          <h2 className="font-bold text-lg mb-4 text-indigo-900">AI Coach Insights</h2>
          <div className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100 italic">
            {insights}
          </div>
        </div>

        {/* NEW FEATURE: Meal Breakdown Section */}
        <div className="bg-white p-6 rounded-2xl border border-indigo-50 shadow-sm lg:col-span-3">
          <h2 className="font-bold text-lg mb-4 text-indigo-900">Food Log Breakdown</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {mealGroups.map(group => {
              const items = getMealItems(group.key);
              const totalCals = getMealCals(group.key);
              
              return (
                <div key={group.key} className="p-4 rounded-xl border border-gray-100 bg-gray-50 flex flex-col">
                  <div className="flex justify-between items-center mb-4 border-b border-gray-200 pb-3">
                    <h3 className="font-bold text-gray-800 flex items-center gap-2">
                      <span>{group.icon}</span> {group.key}
                    </h3>
                    <span className="text-sm font-bold text-indigo-600">{totalCals.toFixed(0)} kcal</span>
                  </div>
                  
                  {items.length > 0 ? (
                    <ul className="space-y-3 flex-1">
                      {items.map((item: any, idx: number) => {
                        const f = item.food || {};
                        const s = item.serving || 1;
                        const c = ((f.calories_kcal || f.calories || 0) * s).toFixed(0);
                        return (
                          <li key={idx} className="text-sm flex justify-between items-start text-gray-700">
                            <span className="pr-2 leading-tight">
                              <span className="font-semibold text-gray-900">{s}x</span> {f.name}
                            </span>
                            <span className="text-xs text-gray-500 font-medium whitespace-nowrap mt-0.5">{c} kcal</span>
                          </li>
                        )
                      })}
                    </ul>
                  ) : (
                    <div className="flex-1 flex items-center justify-center py-4">
                      <p className="text-sm text-gray-400 italic">No food logged yet.</p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
        
      </div>
    </div>
  );
}

// Logic for Red/Exceed Bars
function MicroCard({ label, val, target, unit }: any) {
  const percentage = (val / target) * 100;
  const isExceeded = percentage > 100;
  const barWidth = Math.min(percentage, 100);

  return (
    <div className="bg-white p-4 rounded-2xl border border-gray-100">
      <div className="flex justify-between mb-2 text-xs font-bold text-gray-500">
        <span>{label}</span>
        <span className={isExceeded ? "text-red-500" : "text-indigo-600"}>
          {percentage.toFixed(0)}% {isExceeded ? "Exceeded" : ""}
        </span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div 
          className={`h-full rounded-full ${isExceeded ? "bg-red-500" : "bg-indigo-500"}`} 
          style={{ width: `${barWidth}%` }} 
        />
      </div>
      <p className="text-[10px] mt-1 text-gray-400">{val.toFixed(1)} / {target} {unit}</p>
    </div>
  );
}

function StatCard({ label, value, unit, color }: any) {
  return (
    <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center">
      <span className={`${color} w-2 h-2 rounded-full mb-2`}></span>
      <p className="text-[10px] uppercase text-gray-400 font-bold tracking-widest">{label}</p>
      <p className="text-xl font-black text-gray-800">{value} <span className="text-xs font-normal text-gray-400">{unit}</span></p>
    </div>
  );
}