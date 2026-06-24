'use client';

import {
  IndianRupee,
  CalendarDays,
  CalendarRange,
  Receipt,
  TrendingUp,
  Trophy,
  Repeat,
} from 'lucide-react';
import { useSalesAnalytics } from '@/hooks/useSalesAnalytics';
import { formatPrice } from '@/lib/utils';
import StatsCard from '@/components/admin/StatsCard';
import Skeleton from '@/components/ui/Skeleton';

export default function SalesStats() {
  const { data, isLoading } = useSalesAnalytics();

  if (isLoading || !data) {
    return (
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          label="Today"
          value={formatPrice(data.today.revenue)}
          icon={IndianRupee}
          accent="green"
          hint={`${data.today.count} sale${data.today.count === 1 ? '' : 's'}`}
        />
        <StatsCard
          label="This week"
          value={formatPrice(data.week.revenue)}
          icon={CalendarDays}
          accent="blue"
          hint={`${data.week.count} sale${data.week.count === 1 ? '' : 's'}`}
        />
        <StatsCard
          label="This month"
          value={formatPrice(data.month.revenue)}
          icon={CalendarRange}
          accent="blue"
          hint={`${data.month.count} sale${data.month.count === 1 ? '' : 's'}`}
        />
        <StatsCard
          label="Avg. order value"
          value={formatPrice(data.averageOrderValue)}
          icon={TrendingUp}
          accent="amber"
          hint={`${data.totalInvoices} invoices total`}
        />
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        {/* Best sellers */}
        <div className="rounded-lg border border-admin-border bg-admin-surface p-5">
          <div className="mb-4 flex items-center gap-2">
            <Trophy className="h-4 w-4 text-admin-amber" />
            <h3 className="text-sm font-semibold text-admin-text">
              Best selling products
            </h3>
          </div>
          {data.bestSellers.length === 0 ? (
            <p className="py-6 text-center text-sm text-admin-mute">
              No sales recorded yet.
            </p>
          ) : (
            <ul className="space-y-1">
              {data.bestSellers.map((b, i) => (
                <li
                  key={`${b.productName}-${i}`}
                  className="flex items-center gap-3 rounded-md px-2 py-2 hover:bg-admin-surface-2"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-admin-surface-2 text-xs font-semibold text-admin-text-soft">
                    {i + 1}
                  </span>
                  <p className="min-w-0 flex-1 truncate text-sm text-admin-text">
                    {b.productName}
                  </p>
                  <div className="text-right">
                    <p className="text-sm font-medium text-admin-text">
                      {b.unitsSold} sold
                    </p>
                    <p className="text-xs text-admin-mute">
                      {formatPrice(b.revenue)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Repeat customers */}
        <div className="rounded-lg border border-admin-border bg-admin-surface p-5">
          <div className="mb-4 flex items-center gap-2">
            <Repeat className="h-4 w-4 text-admin-green" />
            <h3 className="text-sm font-semibold text-admin-text">
              Repeat customers
            </h3>
          </div>
          {data.repeatCustomers.length === 0 ? (
            <p className="py-6 text-center text-sm text-admin-mute">
              No repeat customers yet.
            </p>
          ) : (
            <ul className="space-y-1">
              {data.repeatCustomers.map((c) => (
                <li
                  key={c.customerMobile}
                  className="flex items-center gap-3 rounded-md px-2 py-2 hover:bg-admin-surface-2"
                >
                  <Receipt className="h-4 w-4 shrink-0 text-admin-text-soft" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm text-admin-text">
                      {c.customerName || c.customerMobile}
                    </p>
                    {c.customerName && (
                      <p className="text-xs text-admin-mute">
                        {c.customerMobile}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-admin-text">
                      {c.orders} orders
                    </p>
                    <p className="text-xs text-admin-mute">
                      {formatPrice(c.totalSpent)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
