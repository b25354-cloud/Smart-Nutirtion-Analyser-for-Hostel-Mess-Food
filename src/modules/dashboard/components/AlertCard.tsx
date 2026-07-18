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

interface AlertCardProps {
  nutrition: Nutrition;
  remaining: Remaining;
}

export default function AlertCard({
  nutrition,
  remaining,
}: AlertCardProps) {
  const alerts: {
    title: string;
    message: string;
    color: string;
    icon: string;
  }[] = [];

  // Sodium
  if (nutrition.sodium > 2000) {
    alerts.push({
      icon: "🔴",
      title: "High Sodium",
      message: `Exceeded by ${Math.round(
        nutrition.sodium - 2000
      )} mg`,
      color:
        "bg-red-50 border-red-200 text-red-700",
    });
  }

  // Protein
  if (remaining.protein > 20) {
    alerts.push({
      icon: "🟡",
      title: "Protein Low",
      message: `${remaining.protein.toFixed(
        1
      )} g still needed today`,
      color:
        "bg-yellow-50 border-yellow-200 text-yellow-700",
    });
  }

  // Fiber
  if (remaining.fiber > 8) {
    alerts.push({
      icon: "🟠",
      title: "Low Fiber",
      message: "Include fruits or salad.",
      color:
        "bg-orange-50 border-orange-200 text-orange-700",
    });
  }

  // Calcium
  if (remaining.calcium <= 0) {
    alerts.push({
      icon: "🟢",
      title: "Calcium Goal Met",
      message:
        "Excellent! Daily target achieved.",
      color:
        "bg-green-50 border-green-200 text-green-700",
    });
  }

  // Calories
  if (nutrition.calories < 1200) {
    alerts.push({
      icon: "🔵",
      title: "Low Calories",
      message:
        "You may need another healthy meal.",
      color:
        "bg-blue-50 border-blue-200 text-blue-700",
    });
  }

  if (alerts.length === 0) {
    alerts.push({
      icon: "🎉",
      title: "Everything Looks Great!",
      message:
        "Your nutrition is well balanced today.",
      color:
        "bg-green-50 border-green-200 text-green-700",
    });
  }

  return (
    <div className="rounded-2xl border bg-white shadow-md p-6">

      <h2 className="text-xl font-bold mb-6">
        🚨 Smart Alerts
      </h2>

      <div className="space-y-4">

        {alerts.map((alert, index) => (
          <div
            key={index}
            className={`rounded-xl border p-4 ${alert.color}`}
          >
            <div className="flex items-start gap-3">

              <div className="text-2xl">
                {alert.icon}
              </div>

              <div>

                <h3 className="font-semibold">
                  {alert.title}
                </h3>

                <p className="text-sm mt-1">
                  {alert.message}
                </p>

              </div>

            </div>
          </div>
        ))}

      </div>

    </div>
  );
}