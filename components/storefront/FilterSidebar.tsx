'use client';

import { cn } from '@/lib/utils';
import { FILTER_GROUPS, useFilters } from './filters';

export default function FilterSidebar() {
  const { get, toggle, clearAll, activeCount } = useFilters();

  return (
    <aside className="w-full">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-medium text-nike-ink">Filters</h2>
        {activeCount > 0 && (
          <button
            onClick={clearAll}
            className="text-sm text-nike-mute underline-offset-2 hover:text-nike-ink hover:underline"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="mt-4 divide-y divide-nike-hairline-soft">
        {FILTER_GROUPS.map((group) => {
          const active = get(group.key);
          return (
            <div key={group.key} className="py-5">
              <h3 className="mb-3 text-sm font-medium text-nike-ink">
                {group.label}
              </h3>
              <div className="flex flex-wrap gap-2">
                {group.options.map((opt) => {
                  const isActive = active === opt;
                  return (
                    <button
                      key={opt}
                      onClick={() => toggle(group.key, opt)}
                      className={cn(
                        'rounded-full border px-3 py-1.5 text-sm transition-colors',
                        isActive
                          ? 'border-nike-ink bg-nike-ink text-white'
                          : 'border-nike-hairline bg-white text-nike-charcoal hover:border-nike-ink'
                      )}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
