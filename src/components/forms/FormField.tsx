import type { PropsWithChildren } from 'react';

interface FormFieldProps extends PropsWithChildren {
  label: string;
  error?: string;
}

export const FormField = ({ label, error, children }: FormFieldProps) => (
  <label className="block space-y-2">
    <span className="text-sm font-medium text-text-secondary">{label}</span>
    {children}
    {error ? <p className="text-xs text-danger">{error}</p> : null}
  </label>
);
