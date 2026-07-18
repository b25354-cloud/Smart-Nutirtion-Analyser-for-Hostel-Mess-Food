interface LoaderProps {
  label?: string;
}

export const Loader = ({ label = 'Loading...' }: LoaderProps) => (
  <div className="flex min-h-40 items-center justify-center text-text-secondary">{label}</div>
);
