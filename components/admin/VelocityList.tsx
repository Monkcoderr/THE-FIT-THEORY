'use client';

import Link from 'next/link';
import { Flame, Snowflake } from 'lucide-react';
import type { VelocityItem, DeadStockItem } from '@/types';
import { formatPrice } from '@/lib/utils';

interface VelocityListProps {
  fastMovers: VelocityItem[];
  deadStock: DeadStockItem[];
}

export default function VelocityList({
  fastMovers,
  deadStock,
}: VelocityListProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {/* Fast movers */}
      <div className="rounded-lg border border-admin-border bg-admin-surface p-5">
        <div className="mb-4 flex items-center gap-2">
          <Flame className="h-4 w-4 text-admin-amber" />
          <h3 className="text-sm font-semibold text-admin-text">
            Fast movers
          </h3>
          <span className="text-xs text-admin-mute">(last 30 days)</span>
        </div>
        {fastMovers.length === 0 ? (
          <p className="py-8 text-center text-sm text-admin-mute">
            No sales recorded yet.
          </p>
        ) : (
          <ul className="space-y-3">
            {fastMovers.map((item, i) => (
              <li
                key={item.productId}
                className="flex items-center justify-between gap-3"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-admin-surface-2 text-xs font-medium text-admin-text-soft">
                    {i + 1}
                  </span>
                  <span className="truncate text-sm text-admin-text">
                    {item.productTitle}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-admin-text">
                    {item.unitsSold} sold
                  </p>
                  <p className="text-xs text-admin-mute">
                    {formatPrice(item.revenue)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Dead stock */}
      <div className="rounded-lg border border-admin-border bg-admin-surface p-5">
        <div className="mb-4 flex items-center gap-2">
          <Snowflake className="h-4 w-4 text-admin-blue" />
          <h3 className="text-sm font-semibold text-admin-text">Dead stock</h3>
          <span className="text-xs text-admin-mute">(no sales in 30d)</span>
        </div>
        {deadStock.length === 0 ? (
          <p className="py-8 text-center text-sm text-admin-mute">
            No dead stock — everything is moving!
          </p>
        ) : (
          <ul className="space-y-3">
            {deadStock.map((item) => (
              <li
                key={item._id}
                className="flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <Link
                    href={`/admin/products/${item._id}/edit`}
                    className="truncate text-sm text-admin-text hover:text-admin-blue"
                  >
                    {item.title}
                  </Link>
                  <p className="text-xs text-admin-mute">
                    {item.totalStock} in stock · {item.daysSinceCreated}d old
                  </p>
                </div>
                <span className="shrink-0 text-sm text-admin-text-soft">
                  {formatPrice(item.price)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
