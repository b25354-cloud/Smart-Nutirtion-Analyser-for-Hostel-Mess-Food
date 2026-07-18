interface StatCardProps {
  title: string;
  value: string | number;
  emoji: string;
  subtitle?: string;
  color?: "blue" | "green" | "yellow" | "red" | "purple";
}

const colorMap = {
  blue: "from-blue-500 to-cyan-500",
  green: "from-green-500 to-emerald-500",
  yellow: "from-yellow-500 to-orange-500",
  red: "from-red-500 to-pink-500",
  purple: "from-purple-500 to-indigo-500",
};

export default function StatCard({
  title,
  value,
  emoji,
  subtitle,
  color = "blue",
}: StatCardProps) {
  return (
    <div
      className={`
        rounded-2xl
        bg-gradient-to-r
        ${colorMap[color]}
        text-white
        shadow-lg
        hover:shadow-2xl
        hover:scale-[1.03]
        transition-all
        duration-300
        p-5
      `}
    >
      <div className="flex justify-between items-start">

        <div>

          <p className="text-sm opacity-90 font-medium">
            {title}
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {value}
          </h2>

          {subtitle && (
            <p className="text-sm mt-3 opacity-90">
              {subtitle}
            </p>
          )}

        </div>

        <div className="text-5xl opacity-90">
          {emoji}
        </div>

      </div>
    </div>
  );
}