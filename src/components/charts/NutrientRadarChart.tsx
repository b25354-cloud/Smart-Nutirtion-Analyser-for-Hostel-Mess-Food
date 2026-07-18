import { PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer } from 'recharts';

interface NutrientRadarChartProps {
  data: Array<{ nutrient: string; value: number }>;
}

export const NutrientRadarChart = ({ data }: NutrientRadarChartProps) => (
  <div className="h-72 w-full">
    <ResponsiveContainer>
      <RadarChart data={data}>
        <PolarGrid />
        <PolarAngleAxis dataKey="nutrient" />
        <Radar dataKey="value" fill="var(--color-primary)" fillOpacity={0.3} stroke="var(--color-primary)" />
      </RadarChart>
    </ResponsiveContainer>
  </div>
);
