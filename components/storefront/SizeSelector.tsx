'use client';

import type { Variant } from '@/types';
import { cn } from '@/lib/utils';

interface SizeSelectorProps {
  variants: Variant[];
  selected: string | null;
  onSelect: (size: string) => void;
}

export default function SizeSelector({
  variants,
  selected,
  onSelect,
}: SizeSelectorProps) {
  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
      {variants.map((v) => {
        const soldOut = v.stock <= 0;
        const isSelected = selected === v.size;
        return (
          <button
            key={v.size}
            type="button"
            disabled={soldOut}
            onClick={() => onSelect(v.size)}
            className={cn(
              'relative flex h-12 items-center justify-center rounded-md border text-sm font-medium transition-colors',
              soldOut
                ? 'cursor-not-allowed border-nike-hairline-soft text-nike-stone'
                : isSelected
                  ? 'border-nike-ink bg-nike-ink text-white'
                  : 'border-nike-hairline text-nike-ink hover:border-nike-ink'
            )}
          >
            {v.size}
            {soldOut && (
              <span className="absolute inset-x-2 top-1/2 h-px -translate-y-1/2 bg-nike-hairline" />
            )}
          </button>
        );
      })}
    </div>
  );
}
