import { cn } from '@/lib/utils';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 'admin' dark shimmer or 'nike' light shimmer */
  theme?: 'admin' | 'nike';
}

export default function Skeleton({
  className,
  theme = 'admin',
  ...props
}: SkeletonProps) {
  return (
    <div
      className={cn(
        'skeleton-shimmer rounded-md',
        theme === 'admin' ? 'bg-admin-surface-2' : 'bg-nike-cloud',
        className
      )}
      {...props}
    />
  );
}
