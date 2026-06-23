import type { StockStatus } from '@/types';
import { STOCK_CONFIG } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface StockBadgeProps {
  status: StockStatus;
  className?: string;
}

// Premium storefront stock indicator — soft rounded capsule with backdrop blur
// so it stays legible over product imagery.
export default function StockBadge({ status, className }: StockBadgeProps) {
  const cfg = STOCK_CONFIG[status];
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold leading-none backdrop-blur-md ring-1 ring-inset ring-white/40',
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
