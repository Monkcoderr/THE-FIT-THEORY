'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { Search, PackageSearch, Plus } from 'lucide-react';
import type { Product } from '@/types';
import { cn, formatPrice, CATEGORIES } from '@/lib/utils';
import Input from '@/components/ui/Input';

interface ProductSearchPanelProps {
  products: Product[];
  isLoading: boolean;
  /** quantity already in the cart per `${productId}:${size}` key */
  inCart: Record<string, number>;
  onAdd: (product: Product, size: string) => void;
}

export default function ProductSearchPanel({
  products,
  isLoading,
  inCart,
  onAdd,
}: ProductSearchPanelProps) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>('');

  const results = useMemo(() => {
    const term = search.trim().toLowerCase();
    return products.filter((p) => {
      const matchesTerm =
        !term ||
        p.title.toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term);
      const matchesCategory = !category || p.category === category;
      return matchesTerm && matchesCategory && p.totalStock > 0;
    });
  }, [products, search, category]);

  return (
    <div className="flex h-full flex-col rounded-lg border border-admin-border bg-admin-surface">
      <div className="space-y-3 border-b border-admin-border p-4">
        <Input
          placeholder="Search by product name…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          leftElement={<Search className="h-4 w-4 text-admin-mute" />}
          aria-label="Search products"
        />
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => setCategory('')}
            className={cn(
              'h-8 rounded-full border px-3 text-xs font-medium transition-colors',
              category === ''
                ? 'border-admin-blue bg-admin-blue/10 text-admin-blue'
                : 'border-admin-border bg-admin-surface-2 text-admin-text-soft hover:text-admin-text'
            )}
          >
            All
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(category === c ? '' : c)}
              className={cn(
                'h-8 rounded-full border px-3 text-xs font-medium transition-colors',
                category === c
                  ? 'border-admin-blue bg-admin-blue/10 text-admin-blue'
                  : 'border-admin-border bg-admin-surface-2 text-admin-text-soft hover:text-admin-text'
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="admin-scroll flex-1 overflow-y-auto p-3">
        {isLoading ? (
          <p className="py-10 text-center text-sm text-admin-mute">
            Loading products…
          </p>
        ) : results.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <PackageSearch className="h-9 w-9 text-admin-mute" />
            <p className="mt-3 text-sm font-medium text-admin-text">
              No products found
            </p>
            <p className="mt-1 text-sm text-admin-mute">
              Try a different name or category.
            </p>
          </div>
        ) : (
          <ul className="space-y-2">
            {results.map((p) => (
              <li
                key={p._id}
                className="rounded-md border border-admin-border bg-admin-surface-2 p-3"
              >
                <div className="flex items-start gap-3">
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded bg-admin-bg">
                    {p.images?.[0] && (
                      <Image
                        src={p.images[0]}
                        alt={p.title}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-admin-text">
                      {p.title}
                    </p>
                    <p className="text-xs text-admin-mute">
                      {p.category} · {formatPrice(p.price)}
                    </p>
                  </div>
                </div>

                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {p.variants.map((v) => {
                    const key = `${p._id}:${v.size}`;
                    const inCartQty = inCart[key] ?? 0;
                    const soldOut = v.stock <= 0;
                    const maxed = inCartQty >= v.stock;
                    return (
                      <button
                        key={v.size}
                        type="button"
                        disabled={soldOut || maxed}
                        onClick={() => onAdd(p, v.size)}
                        className={cn(
                          'inline-flex h-8 items-center gap-1 rounded-md border px-2.5 text-xs font-medium transition-colors',
                          soldOut || maxed
                            ? 'cursor-not-allowed border-admin-border bg-admin-bg text-admin-mute opacity-50'
                            : 'border-admin-border bg-admin-surface text-admin-text hover:border-admin-blue hover:text-admin-blue'
                        )}
                        title={
                          soldOut
                            ? 'Out of stock'
                            : `Add ${p.title} (${v.size})`
                        }
                      >
                        <Plus className="h-3 w-3" />
                        {v.size}
                        <span className="text-admin-mute">({v.stock})</span>
                      </button>
                    );
                  })}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
