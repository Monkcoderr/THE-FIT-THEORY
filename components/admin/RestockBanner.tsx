'use client';

import { AlertTriangle, X } from 'lucide-react';
import { useState } from 'react';
import type { Product } from '@/types';

interface RestockBannerProps {
  products: Product[];
}

// Appears when any variant has stock < 3 (low) or 0 (out).
export default function RestockBanner({ products }: RestockBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  const lowItems = products.filter((p) =>
    p.variants.some((v) => v.stock < 3)
  );

  if (dismissed || lowItems.length === 0) return null;

  const outCount = products.filter((p) => p.totalStock === 0).length;

  return (
    <div className="flex items-start gap-3 rounded-lg border border-admin-amber/30 bg-admin-amber/10 p-4">
      <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-admin-amber" />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-admin-amber">
          {lowItems.length} product{lowItems.length > 1 ? 's' : ''} need
          {lowItems.length === 1 ? 's' : ''} restocking
          {outCount > 0 && ` · ${outCount} fully out of stock`}
        </p>
        <p className="mt-0.5 text-xs text-admin-text-soft">
          {lowItems
            .slice(0, 4)
            .map((p) => p.title)
            .join(', ')}
          {lowItems.length > 4 && ` +${lowItems.length - 4} more`}
        </p>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded text-admin-amber/80 hover:bg-admin-amber/10"
        aria-label="Dismiss"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
