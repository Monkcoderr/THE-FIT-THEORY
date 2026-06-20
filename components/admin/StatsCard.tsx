'use client';

import { type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  label: string;
  value: string;
  icon?: LucideIcon;
  hint?: string;
  accent?: 'blue' | 'green' | 'amber' | 'red' | 'default';
}

const accentMap: Record<NonNullable<StatsCardProps['accent']>, string> = {
  blue: 'text-admin-blue',
  green: 'text-admin-green',
  amber: 'text-admin-amber',
  red: 'text-admin-red',
  default: 'text-admin-text-soft',
};

export default function StatsCard({
  label,
  value,
  icon: Icon,
  hint,
  accent = 'default',
}: StatsCardProps) {
  return (
    <div className="rounded-lg border border-admin-border bg-admin-surface p-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-admin-text-soft">{label}</span>
        {Icon && <Icon className={cn('h-4 w-4', accentMap[accent])} />}
      </div>
      <p className="mt-2 text-2xl font-semibold tracking-tight text-admin-text">
        {value}
      </p>
      {hint && <p className="mt-1 text-xs text-admin-mute">{hint}</p>}
    </div>
  );
}
