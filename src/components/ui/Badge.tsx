import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'accent';
  className?: string;
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  const variants = {
    default: 'bg-subtle text-muted border-border',
    success: 'bg-success-bg text-success border-success/20',
    warning: 'bg-warning-bg text-warning border-warning/20',
    error: 'bg-error-bg text-error border-error/20',
    info: 'bg-info-bg text-info border-info/20',
    accent: 'bg-accent-glow text-accent border-accent/20',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full border',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
