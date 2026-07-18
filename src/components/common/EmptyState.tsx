interface EmptyStateProps {
  title: string;
  description?: string;
}

export const EmptyState = ({ title, description }: EmptyStateProps) => (
  <div className="rounded-xl border border-dashed border-border p-6 text-center">
    <h3 className="text-base font-semibold">{title}</h3>
    {description ? <p className="mt-2 text-sm text-text-secondary">{description}</p> : null}
  </div>
);
