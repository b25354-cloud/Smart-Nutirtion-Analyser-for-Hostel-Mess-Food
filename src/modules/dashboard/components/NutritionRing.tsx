interface NutritionRingProps {
  score: number;
}

export default function NutritionRing({
  score,
}: NutritionRingProps) {
  const radius = 75;
  const stroke = 12;

  const normalizedRadius = radius - stroke / 2;

  const circumference =
    2 * Math.PI * normalizedRadius;

  const progress = Math.min(
    Math.max(score, 0),
    100
  );

  const strokeDashoffset =
    circumference -
    (progress / 100) * circumference;

  const getColor = () => {
    if (score >= 85)
      return "#22c55e";

    if (score >= 70)
      return "#3b82f6";

    if (score >= 50)
      return "#f59e0b";

    return "#ef4444";
  };

  const getStatus = () => {
    if (score >= 85)
      return "Excellent";

    if (score >= 70)
      return "Good";

    if (score >= 50)
      return "Average";

    return "Needs Improvement";
  };

  return (
    <div className="rounded-2xl border bg-white shadow-md p-6 flex flex-col items-center">

      <h2 className="text-xl font-bold mb-6">
        Nutrition Score
      </h2>

      <div className="relative w-44 h-44">

        <svg
          className="w-44 h-44 -rotate-90"
          viewBox="0 0 180 180"
        >
          <circle
            cx="90"
            cy="90"
            r={normalizedRadius}
            fill="transparent"
            stroke="#e5e7eb"
            strokeWidth={stroke}
          />

          <circle
            cx="90"
            cy="90"
            r={normalizedRadius}
            fill="transparent"
            stroke={getColor()}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{
              transition:
                "stroke-dashoffset 0.8s ease",
            }}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col justify-center items-center">

          <div
            className="text-5xl font-bold"
            style={{
              color: getColor(),
            }}
          >
            {score}
          </div>

          <div className="text-sm text-gray-500 mt-1">
            /100
          </div>

        </div>

      </div>

      <div
        className="mt-6 px-4 py-2 rounded-full text-sm font-semibold"
        style={{
          backgroundColor: `${getColor()}15`,
          color: getColor(),
        }}
      >
        {getStatus()}
      </div>

      <p className="text-center text-gray-500 text-sm mt-4 leading-relaxed">
        Your nutrition score summarizes how closely
        today's meals match the recommended daily
        nutritional targets.
      </p>

    </div>
  );
}