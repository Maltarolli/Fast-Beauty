'use client';

import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = 'relative inline-flex items-center justify-center font-semibold rounded-2xl transition-all duration-300 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 cursor-pointer';

  const variants = {
    primary: 'gradient-accent text-white shadow-lg shadow-accent/20 hover:shadow-accent/40 hover:brightness-110 btn-glow',
    secondary: 'bg-card border border-border text-foreground hover:bg-card-hover hover:border-border-light',
    ghost: 'text-muted hover:text-foreground hover-subtle',
    danger: 'bg-error/10 text-error border border-error/20 hover:bg-error/20 hover:border-error/40',
    outline: 'border border-accent/30 text-accent hover:bg-accent/10 hover:border-accent/50',
  };

  const sizes = {
    sm: 'text-sm px-4 py-2 gap-1.5',
    md: 'text-sm px-6 py-3 gap-2',
    lg: 'text-base px-8 py-4 gap-2.5',
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
}
