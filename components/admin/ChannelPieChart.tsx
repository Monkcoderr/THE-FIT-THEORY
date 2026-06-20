'use client';

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from 'recharts';
import { PieChart as PieIcon } from 'lucide-react';
import type { ChannelBreakdown } from '@/types';
import { formatPrice } from '@/lib/utils';

interface ChannelPieChartProps {
  data: ChannelBreakdown[];
}

const COLORS: Record<string, string> = {
  'Walk-in': '#0070f3',
  WhatsApp: '#50e3c2',
};

export default function ChannelPieChart({ data }: ChannelPieChartProps) {
  const total = data.reduce((s, d) => s + d.count, 0);
  const chartData = data.filter((d) => d.count > 0);

  return (
    <div className="rounded-lg border border-admin-border bg-admin-surface p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-admin-text">
            Sales channels
          </h3>
          <p className="text-xs text-admin-mute">Walk-in vs WhatsApp</p>
        </div>
        <PieIcon className="h-4 w-4 text-admin-green" />
      </div>

      {total === 0 ? (
        <div className="flex h-56 flex-col items-center justify-center text-center">
          <p className="text-sm text-admin-text-soft">No sales yet</p>
          <p className="text-xs text-admin-mute">
            Channel split will appear here.
          </p>
        </div>
      ) : (
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="count"
                nameKey="channel"
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={2}
                stroke="none"
              >
                {chartData.map((entry) => (
                  <Cell
                    key={entry.channel}
                    fill={COLORS[entry.channel] ?? '#888888'}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0a0a0a',
                  border: '1px solid #262626',
                  borderRadius: 8,
                  fontSize: 12,
                  color: '#ededed',
                }}
                formatter={(value: number, _name, props) => [
                  `${value} units · ${formatPrice(
                    (props.payload as ChannelBreakdown).revenue
                  )}`,
                  (props.payload as ChannelBreakdown).channel,
                ]}
              />
              <Legend
                verticalAlign="bottom"
                iconType="circle"
                formatter={(value) => (
                  <span style={{ color: '#a1a1a1', fontSize: 12 }}>
                    {value}
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
