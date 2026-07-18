interface MealTagProps {
  mealType: string;
}

export const MealTag = ({ mealType }: MealTagProps) => (
  <span className="rounded-md bg-primary/10 px-2 py-1 text-xs font-medium capitalize text-primary">{mealType}</span>
);
