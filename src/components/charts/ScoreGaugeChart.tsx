import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';

interface ScoreGaugeChartProps {
  score: number;
}

const COLORS = ['var(--color-primary)', 'var(--color-border)'];

export const ScoreGaugeChart = ({ score }: ScoreGaugeChartProps) => {
  const normalized = Math.max(0, Math.min(100, score));

  return (
    <div className="h-56 w-full">
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={[
              { name: 'score', value: normalized },
              { name: 'rest', value: 100 - normalized },
            ]}
            dataKey="value"
            innerRadius={60}
            outerRadius={80}
            startAngle={180}
            endAngle={0}
          >
            {[0, 1].map((index) => (
              <Cell key={index} fill={COLORS[index]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
