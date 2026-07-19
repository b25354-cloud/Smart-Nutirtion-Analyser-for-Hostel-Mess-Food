import type { PropsWithChildren } from 'react';

interface CardProps extends PropsWithChildren {
  className?: string;
}

export const Card = ({ children, className = '' }: CardProps) => (
  <div className={`rounded-xl border border-border bg-surface-elevated p-4 shadow-sm ${className}`}>
    {children}
  </div>
);