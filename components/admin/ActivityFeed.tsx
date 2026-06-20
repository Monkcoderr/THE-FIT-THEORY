'use client';

import { Store, MessageCircle, Receipt } from 'lucide-react';
import type { SaleRecord } from '@/types';
import { cn, formatPrice, timeAgo } from '@/lib/utils';

interface ActivityFeedProps {
  sales: SaleRecord[];
  /** Optional title override */
  title?: string;
}

export default function ActivityFeed({
  sales,
  title = 'Recent activity',
}: ActivityFeedProps) {
  return (
    <div className="rounded-lg border border-admin-border bg-admin-surface p-5">
      <div className="mb-4 flex items-center gap-2">
        <Receipt className="h-4 w-4 text-admin-text-soft" />
        <h3 className="text-sm font-semibold text-admin-text">{title}</h3>
      </div>

      {sales.length === 0 ? (
        <p className="py-8 text-center text-sm text-admin-mute">
          No sales logged yet.
        </p>
      ) : (
        <ul className="space-y-1">
          {sales.map((s) => {
            const isWalkIn = s.channel === 'Walk-in';
            const Icon = isWalkIn ? Store : MessageCircle;
            return (
              <li
                key={s._id}
                className="flex items-center gap-3 rounded-md px-2 py-2 transition-colors hover:bg-admin-surface-2"
              >
                <span
                  className={cn(
                    'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
                    isWalkIn
                      ? 'bg-admin-blue/10 text-admin-blue'
                      : 'bg-admin-green/10 text-admin-green'
                  )}
                >
                  <Icon className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-admin-text">
                    {s.productTitle}
                  </p>
                  <p className="text-xs text-admin-mute">
                    {s.quantity}× · Size {s.sizeSold} · {s.channel}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-admin-text">
                    {formatPrice(s.revenue)}
                  </p>
                  <p className="text-xs text-admin-mute">{timeAgo(s.date)}</p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
