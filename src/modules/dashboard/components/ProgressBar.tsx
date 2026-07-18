interface ProgressBarProps {
  label: string;
  current: number;
  target: number;
  unit?: string;
}

export default function ProgressBar({
  label,
  current,
  target,
  unit = "",
}: ProgressBarProps) {
  const percentage = (current / target) * 100;

  const progress = Math.min(percentage, 100);

  const getBarColor = () => {
    if (percentage < 70) return "bg-red-500";
    if (percentage < 90) return "bg-yellow-500";
    if (percentage <= 110) return "bg-green-500";
    if (percentage <= 130) return "bg-orange-500";

    return "bg-red-600";
  };

  const getStatus = () => {
    if (percentage < 70) return "Low";
    if (percentage < 90) return "Slightly Low";
    if (percentage <= 110) return "Perfect";
    if (percentage <= 130) return "High";

    return "Too High";
  };

  const getStatusColor = () => {
    if (percentage < 70) return "text-red-600";
    if (percentage < 90) return "text-yellow-600";
    if (percentage <= 110) return "text-green-600";
    if (percentage <= 130) return "text-orange-600";

    return "text-red-700";
  };

  return (
    <div className="mb-6">

      <div className="flex justify-between items-center mb-2">

        <span className="font-medium text-gray-700">
          {label}
        </span>

        <span className={`font-semibold ${getStatusColor()}`}>
          {getStatus()}
        </span>

      </div>

      <div className="w-full h-4 rounded-full bg-gray-200 overflow-hidden">

        <div
          className={`${getBarColor()} h-4 rounded-full transition-all duration-700`}
          style={{
            width: `${progress}%`,
          }}
        />

      </div>

      <div className="flex justify-between mt-2 text-sm text-gray-500">

        <span>
          {current.toFixed(1)}
          {unit}
        </span>

        <span>
          Target: {target}
          {unit}
        </span>

      </div>

      <div className="mt-1 text-right text-xs font-medium text-gray-500">
        {percentage.toFixed(0)}%
      </div>

      {percentage > 100 && (
        <div className="mt-2 text-sm text-red-600 font-medium">
          ▲ Exceeded by {(percentage - 100).toFixed(0)}%
        </div>
      )}

    </div>
  );
}