'use client';

import { X } from 'lucide-react';
import { FILTER_GROUPS, useFilters } from './filters';

// Applied filter pills with individual remove + clear all.
export default function ActiveFilters() {
  const { searchParams, setParam, clearAll, activeCount } = useFilters();

  if (activeCount === 0) return null;

  const active = FILTER_GROUPS.flatMap((g) => {
    const val = searchParams.get(g.key);
    return val ? [{ key: g.key, label: g.label, value: val }] : [];
  });

  return (
    <div className="flex flex-wrap items-center gap-2">
      {active.map((f) => (
        <button
          key={f.key}
          onClick={() => setParam(f.key, null)}
          className="inline-flex items-center gap-1.5 rounded-full bg-nike-cloud px-3 py-1.5 text-sm text-nike-ink transition-colors hover:bg-nike-hairline-soft"
        >
          <span className="text-nike-mute">{f.label}:</span> {f.value}
          <X className="h-3.5 w-3.5" />
        </button>
      ))}
      <button
        onClick={clearAll}
        className="text-sm text-nike-mute underline-offset-2 hover:text-nike-ink hover:underline"
      >
        Clear all
      </button>
    </div>
  );
}
