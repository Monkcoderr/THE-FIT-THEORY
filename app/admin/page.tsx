'use client';

import Link from 'next/link';
import {
  IndianRupee,
  Package,
  AlertTriangle,
  Plus,
  Boxes,
  BarChart3,
  ArrowRight,
} from 'lucide-react';
import { useAnalytics } from '@/hooks/useAnalytics';
import { formatPrice } from '@/lib/utils';
import StatsCard from '@/components/admin/StatsCard';
import ActivityFeed from '@/components/admin/ActivityFeed';
import Skeleton from '@/components/ui/Skeleton';

const QUICK_ACTIONS = [
  {
    href: '/admin/products/new',
    label: 'Add product',
    description: 'Create a new catalog item',
    icon: Plus,
    accent: 'text-admin-blue',
  },
  {
    href: '/admin/inventory',
    label: 'Update inventory',
    description: 'Adjust stock & log sales',
    icon: Boxes,
    accent: 'text-admin-green',
  },
  {
    href: '/admin/analytics',
    label: 'View analytics',
    description: 'Revenue & velocity',
    icon: BarChart3,
    accent: 'text-admin-amber',
  },
];

export default function AdminDashboardPage() {
  const { data, isLoading } = useAnalytics();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-admin-text">
          Welcome back
        </h2>
        <p className="text-sm text-admin-mute">
          Here&apos;s what&apos;s happening in your store today.
        </p>
      </div>

      {/* Stats */}
      {isLoading || !data ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            label="Revenue today"
            value={formatPrice(data.summary.revenueToday)}
            icon={IndianRupee}
            accent="green"
          />
          <StatsCard
            label="Last 7 days"
            value={formatPrice(data.summary.revenue7Days)}
            icon={IndianRupee}
            accent="blue"
          />
          <StatsCard
            label="Active products"
            value={String(data.summary.activeProducts)}
            icon={Package}
            hint={`${data.summary.totalProducts} total`}
          />
          <StatsCard
            label="Needs restock"
            value={String(
              data.summary.lowStockCount + data.summary.outOfStockCount
            )}
            icon={AlertTriangle}
            accent="amber"
            hint={`${data.summary.outOfStockCount} out of stock`}
          />
        </div>
      )}

      {/* Quick actions */}
      <div className="grid gap-3 sm:grid-cols-3">
        {QUICK_ACTIONS.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.href}
              href={action.href}
              className="group flex items-center justify-between rounded-lg border border-admin-border bg-admin-surface p-4 transition-colors hover:border-admin-text-soft"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-md bg-admin-surface-2">
                  <Icon className={`h-5 w-5 ${action.accent}`} />
                </span>
                <div>
                  <p className="text-sm font-medium text-admin-text">
                    {action.label}
                  </p>
                  <p className="text-xs text-admin-mute">
                    {action.description}
                  </p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-admin-mute transition-transform group-hover:translate-x-0.5" />
            </Link>
          );
        })}
      </div>

      {/* Activity feed */}
      {isLoading || !data ? (
        <Skeleton className="h-64 w-full" />
      ) : (
        <ActivityFeed sales={data.recentSales} />
      )}
    </div>
  );
}
