'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Plus, Minus, ShoppingCart, Loader2 } from 'lucide-react';
import type { Product, Size } from '@/types';
import { cn, formatPrice, STOCK_CONFIG } from '@/lib/utils';
import { toast } from '@/components/ui/Toast';

interface InventoryCardProps {
  product: Product;
  onRestock: () => void;
  onSell: (presetSize?: string) => void;
}

export default function InventoryCard({
  product,
  onRestock,
  onSell,
}: InventoryCardProps) {
  const [busySize, setBusySize] = useState<string | null>(null);
  const sc = STOCK_CONFIG[product.stockStatus];

  // Restock a single variant (+1) via PATCH /api/inventory
  async function increment(size: Size) {
    setBusySize(size);
    try {
      const res = await fetch('/api/inventory', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product._id, size, delta: 1 }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? 'Update failed');
      } else {
        onRestock();
      }
    } catch {
      toast.error('Network error');
    } finally {
      setBusySize(null);
    }
  }

  return (
    <div className="rounded-lg border border-admin-border bg-admin-surface p-4">
      <div className="flex items-start gap-3">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-admin-surface-2">
          {product.images[0] && (
            <Image
              src={product.images[0]}
              alt={product.title}
              fill
              sizes="64px"
              className="object-cover"
            />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-admin-text">
            {product.title}
          </p>
          <p className="text-xs text-admin-mute">{formatPrice(product.price)}</p>
          <div className="mt-1 flex items-center gap-1.5">
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: sc.adminColor }}
            />
            <span className="text-xs" style={{ color: sc.adminColor }}>
              {product.totalStock} total · {sc.label}
            </span>
          </div>
        </div>
      </div>

      {/* Variant stock controls */}
      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {product.variants.map((v) => {
          const isBusy = busySize === v.size;
          const low = v.stock > 0 && v.stock < 3;
          return (
            <div
              key={v.size}
              className={cn(
                'flex items-center justify-between rounded-md border bg-admin-surface-2 px-2 py-1.5',
                v.stock === 0
                  ? 'border-admin-red/40'
                  : low
                    ? 'border-admin-amber/40'
                    : 'border-admin-border'
              )}
            >
              <div className="flex flex-col">
                <span className="text-xs font-medium text-admin-text">
                  {v.size}
                </span>
                <span
                  className={cn(
                    'text-[11px]',
                    v.stock === 0
                      ? 'text-admin-red'
                      : low
                        ? 'text-admin-amber'
                        : 'text-admin-mute'
                  )}
                >
                  {v.stock} left
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onSell(v.size)}
                  disabled={v.stock === 0}
                  aria-label={`Sell size ${v.size}`}
                  className="flex h-8 w-8 items-center justify-center rounded text-admin-text-soft hover:bg-admin-border disabled:opacity-30"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => increment(v.size)}
                  disabled={isBusy}
                  aria-label={`Restock size ${v.size}`}
                  className="flex h-8 w-8 items-center justify-center rounded text-admin-green hover:bg-admin-green/10 disabled:opacity-50"
                >
                  {isBusy ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Plus className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <button
        onClick={() => onSell()}
        disabled={product.totalStock === 0}
        className="mt-3 inline-flex h-10 w-full items-center justify-center gap-2 rounded-md bg-admin-surface-2 text-sm font-medium text-admin-text transition-colors hover:bg-admin-border disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ShoppingCart className="h-4 w-4" />
        Log sale
      </button>
    </div>
  );
}
