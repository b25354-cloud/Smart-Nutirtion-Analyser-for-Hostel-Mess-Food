import type { ButtonHTMLAttributes } from 'react';
import { clsx } from 'clsx';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
}

export const Button = ({ variant = 'primary', className, ...props }: ButtonProps) => (
  <button
    className={clsx(
      'rounded-lg px-4 py-2 text-sm font-medium transition',
      {
        'bg-primary text-white hover:opacity-90': variant === 'primary',
        'bg-surface-muted text-text-primary hover:bg-border': variant === 'secondary',
        'text-primary hover:bg-surface-muted': variant === 'ghost',
      },
      className,
    )}
    {...props}
  />
);
