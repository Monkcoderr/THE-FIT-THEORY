import type { StockStatus } from '@/types';
import { STOCK_CONFIG } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface StockBadgeProps {
  status: StockStatus;
  className?: string;
}

// Nike-light storefront stock indicator.
export default function StockBadge({ status, className }: StockBadgeProps) {
  const cfg = STOCK_CONFIG[status];
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium',
        className
      )}
      style={{ backgroundColor: cfg.storefrontBg, color: cfg.storefrontText }}
    >
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: cfg.dotColor }}
      />
      {cfg.nikeLabel}
    </span>
  );
}
