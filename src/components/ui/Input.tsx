'use client';

import { cn } from '@/lib/utils';
import { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-foreground mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              'w-full bg-card border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-dark input-focus transition-all duration-200',
              !!icon && 'pl-11',
              !!error && 'border-error focus:border-error focus:shadow-[0_0_0_3px_rgba(239,68,68,0.15)]',
              className
            )}
            {...props}
          />
        </div>
        {error && (
          <p className="mt-1.5 text-sm text-error animate-fade-in-down">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
