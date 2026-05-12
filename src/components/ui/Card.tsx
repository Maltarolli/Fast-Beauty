import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  interactive?: boolean;
  padding?: 'sm' | 'md' | 'lg';
}

export function Card({ children, className, interactive = false, padding = 'md' }: CardProps) {
  const paddings = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div
      className={cn(
        'bg-card border border-border rounded-2xl',
        paddings[padding],
        interactive && 'card-interactive cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  );
}
