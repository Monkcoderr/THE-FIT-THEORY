import { cn } from '@/lib/utils';

type BadgeVariant =
  | 'default'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'outline';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variants: Record<BadgeVariant, string> = {
  default: 'bg-admin-surface-2 text-admin-text-soft border border-admin-border',
  success: 'bg-admin-green/10 text-admin-green border border-admin-green/20',
  warning: 'bg-admin-amber/10 text-admin-amber border border-admin-amber/20',
  danger: 'bg-admin-red/10 text-admin-red border border-admin-red/20',
  info: 'bg-admin-blue/10 text-admin-blue border border-admin-blue/20',
  outline: 'bg-transparent text-admin-text-soft border border-admin-border',
};

export default function Badge({
  variant = 'default',
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
