interface NutrientChipProps {
  label: string;
  value: string;
}

export const NutrientChip = ({ label, value }: NutrientChipProps) => (
  <span className="inline-flex items-center gap-2 rounded-full bg-surface-muted px-3 py-1 text-xs font-medium text-text-primary">
    {label}: {value}
  </span>
);
