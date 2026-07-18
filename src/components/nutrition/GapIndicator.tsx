interface GapIndicatorProps {
  nutrient: string;
  deficit: number;
}

export const GapIndicator = ({ nutrient, deficit }: GapIndicatorProps) => (
  <div className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-sm">
    <span>{nutrient}</span>
    <span className="font-medium text-warning">-{deficit.toFixed(1)}</span>
  </div>
);
