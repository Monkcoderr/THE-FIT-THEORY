'use client';

import {
  IndianRupee,
  ShoppingBag,
  Package,
  AlertTriangle,
  Calendar,
  CalendarDays,
} from 'lucide-react';
import { useAnalytics } from '@/hooks/useAnalytics';
import { formatPrice } from '@/lib/utils';
import StatsCard from '@/components/admin/StatsCard';
import SalesChart from '@/components/admin/SalesChart';
import ChannelPieChart from '@/components/admin/ChannelPieChart';
import VelocityList from '@/components/admin/VelocityList';
import ActivityFeed from '@/components/admin/ActivityFeed';
import Skeleton from '@/components/ui/Skeleton';

export default function AnalyticsPage() {
  const { data, isLoading, isError } = useAnalytics();

  if (isLoading) {
    return (
      <div className="space-y-5">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          <Skeleton className="h-80 w-full lg:col-span-2" />
          <Skeleton className="h-80 w-full" />
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-admin-border py-20 text-center">
        <AlertTriangle className="h-8 w-8 text-admin-red" />
        <p className="mt-2 text-sm text-admin-text">
          Could not load analytics.
        </p>
        <p className="text-sm text-admin-mute">Please try again shortly.</p>
      </div>
    );
  }

  const { summary } = data;

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-admin-text">Analytics</h2>
        <p className="text-sm text-admin-mute">
          Revenue, channels, and stock velocity.
        </p>
      </div>

      {/* Summary stats */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          label="Total revenue"
          value={formatPrice(summary.totalRevenue)}
          icon={IndianRupee}
          accent="green"
          hint={`${summary.totalSales} units sold`}
        />
        <StatsCard
          label="Today"
          value={formatPrice(summary.revenueToday)}
          icon={Calendar}
          accent="blue"
        />
        <StatsCard
          label="Last 7 days"
          value={formatPrice(summary.revenue7Days)}
          icon={CalendarDays}
          accent="blue"
        />
        <StatsCard
          label="Last 30 days"
          value={formatPrice(summary.revenue30Days)}
          icon={CalendarDays}
          accent="blue"
        />
      </div>

      {/* Inventory stats */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          label="Products"
          value={String(summary.totalProducts)}
          icon={Package}
          hint={`${summary.activeProducts} active`}
        />
        <StatsCard
          label="Active listings"
          value={String(summary.activeProducts)}
          icon={ShoppingBag}
          accent="green"
        />
        <StatsCard
          label="Low stock"
          value={String(summary.lowStockCount)}
          icon={AlertTriangle}
          accent="amber"
        />
        <StatsCard
          label="Out of stock"
          value={String(summary.outOfStockCount)}
          icon={AlertTriangle}
          accent="red"
        />
      </div>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SalesChart data={data.dailyRevenue} />
        </div>
        <ChannelPieChart data={data.channelBreakdown} />
      </div>

      {/* Velocity */}
      <VelocityList fastMovers={data.fastMovers} deadStock={data.deadStock} />

      {/* Activity */}
      <ActivityFeed sales={data.recentSales} title="Recent sales" />
    </div>
  );
}
