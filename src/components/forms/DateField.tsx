import type { InputHTMLAttributes } from 'react';

export const DateField = (props: InputHTMLAttributes<HTMLInputElement>) => (
  <input className="w-full rounded-lg border border-border bg-surface px-3 py-2" type="date" {...props} />
);
