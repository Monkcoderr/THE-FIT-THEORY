'use client';

import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { SlidersHorizontal, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FILTER_GROUPS, useFilters } from './filters';

// Mobile bottom-sheet filters.
export default function FilterSheet() {
  const [open, setOpen] = useState(false);
  const { get, toggle, clearAll, activeCount } = useFilters();

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button className="inline-flex h-11 items-center gap-2 rounded-full border border-nike-hairline bg-white px-5 text-sm font-medium text-nike-ink">
          <SlidersHorizontal className="h-4 w-4" />
          Filters
          {activeCount > 0 && (
            <span className="ml-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-nike-ink px-1 text-xs text-white">
              {activeCount}
            </span>
          )}
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 animate-fade-in" />
        <Dialog.Content className="fixed inset-x-0 bottom-0 z-50 max-h-[85vh] overflow-y-auto rounded-t-2xl bg-white animate-slide-up">
          <div className="sticky top-0 flex items-center justify-between border-b border-nike-hairline-soft bg-white px-4 py-4">
            <Dialog.Title className="text-base font-medium text-nike-ink">
              Filters
            </Dialog.Title>
            <Dialog.Close
              className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-nike-cloud"
              aria-label="Close"
            >
              <X className="h-5 w-5 text-nike-ink" />
            </Dialog.Close>
          </div>

          <div className="divide-y divide-nike-hairline-soft px-4">
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
                            'rounded-full border px-3 py-2 text-sm transition-colors',
                            isActive
                              ? 'border-nike-ink bg-nike-ink text-white'
                              : 'border-nike-hairline bg-white text-nike-charcoal'
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

          <div className="sticky bottom-0 flex gap-3 border-t border-nike-hairline-soft bg-white px-4 py-4">
            <button
              onClick={clearAll}
              className="h-12 flex-1 rounded-full border border-nike-hairline text-sm font-medium text-nike-ink"
            >
              Clear all
            </button>
            <button
              onClick={() => setOpen(false)}
              className="h-12 flex-1 rounded-full bg-nike-ink text-sm font-medium text-white"
            >
              View results
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
