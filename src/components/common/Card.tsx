import type { PropsWithChildren } from 'react';

export const Card = ({ children }: PropsWithChildren) => (
  <div className="rounded-xl border border-border bg-surface-elevated p-4 shadow-sm">{children}</div>
);
