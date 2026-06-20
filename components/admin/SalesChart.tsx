'use client';

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { TrendingUp } from 'lucide-react';
import type { DailyRevenuePoint } from '@/types';
import { formatPrice } from '@/lib/utils';

interface SalesChartProps {
  data: DailyRevenuePoint[];
}

function formatDay(date: string) {
  const d = new Date(date);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

export default function SalesChart({ data }: SalesChartProps) {
  return (
    <div className="rounded-lg border border-admin-border bg-admin-surface p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-admin-text">
            Revenue (last 30 days)
          </h3>
          <p className="text-xs text-admin-mute">Daily sales revenue</p>
        </div>
        <TrendingUp className="h-4 w-4 text-admin-blue" />
      </div>

      {data.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center text-center">
          <p className="text-sm text-admin-text-soft">No sales data yet</p>
          <p className="text-xs text-admin-mute">
            Logged sales will appear here.
          </p>
        </div>
      ) : (
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 4, right: 8, left: -16, bottom: 0 }}
            >
              <defs>
                <linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0070f3" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#0070f3" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#262626"
                vertical={false}
              />
              <XAxis
                dataKey="date"
                tickFormatter={formatDay}
                tick={{ fill: '#888888', fontSize: 11 }}
                axisLine={{ stroke: '#262626' }}
                tickLine={false}
                minTickGap={24}
              />
              <YAxis
                tick={{ fill: '#888888', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `₹${v >= 1000 ? `${v / 1000}k` : v}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0a0a0a',
                  border: '1px solid #262626',
                  borderRadius: 8,
                  fontSize: 12,
                  color: '#ededed',
                }}
                labelFormatter={(l) => formatDay(l as string)}
                formatter={(value: number) => [formatPrice(value), 'Revenue']}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#0070f3"
                strokeWidth={2}
                fill="url(#revFill)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
