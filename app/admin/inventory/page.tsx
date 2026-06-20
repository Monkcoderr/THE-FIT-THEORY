'use client';

import { useMemo, useState } from 'react';
import { Search, Boxes } from 'lucide-react';
import { useInventory } from '@/hooks/useInventory';
import type { Product } from '@/types';
import { cn } from '@/lib/utils';
import InventoryCard from '@/components/admin/InventoryCard';
import RestockBanner from '@/components/admin/RestockBanner';
import SaleLogModal from '@/components/admin/SaleLogModal';
import Input from '@/components/ui/Input';
import Skeleton from '@/components/ui/Skeleton';

type StockFilter = 'all' | 'low' | 'out';

export default function InventoryPage() {
  const { products, isLoading, mutate } = useInventory();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<StockFilter>('all');

  const [saleProduct, setSaleProduct] = useState<Product | null>(null);
  const [presetSize, setPresetSize] = useState<string | undefined>(undefined);
  const [modalOpen, setModalOpen] = useState(false);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = p.title
        .toLowerCase()
        .includes(search.trim().toLowerCase());
      const matchesFilter =
        filter === 'all' ||
        (filter === 'low' &&
          p.variants.some((v) => v.stock > 0 && v.stock < 3)) ||
        (filter === 'out' && p.totalStock === 0);
      return matchesSearch && matchesFilter;
    });
  }, [products, search, filter]);

  function openSale(product: Product, size?: string) {
    setSaleProduct(product);
    setPresetSize(size);
    setModalOpen(true);
  }

  const tabs: { key: StockFilter; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'low', label: 'Low stock' },
    { key: 'out', label: 'Out of stock' },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-admin-text">Inventory</h2>
        <p className="text-sm text-admin-mute">
          Adjust stock and log sales in one tap.
        </p>
      </div>

      <RestockBanner products={products} />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-1 rounded-md border border-admin-border bg-admin-surface p-1">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setFilter(t.key)}
              className={cn(
                'h-9 rounded px-3 text-sm font-medium transition-colors',
                filter === t.key
                  ? 'bg-admin-surface-2 text-admin-text'
                  : 'text-admin-text-soft hover:text-admin-text'
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="sm:w-72">
          <Input
            placeholder="Search inventory…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftElement={<Search className="h-4 w-4 text-admin-mute" />}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-52 w-full" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-admin-border bg-admin-surface py-16 text-center">
          <Boxes className="h-10 w-10 text-admin-mute" />
          <p className="mt-3 text-sm font-medium text-admin-text">
            Nothing to show
          </p>
          <p className="mt-1 text-sm text-admin-mute">
            {search || filter !== 'all'
              ? 'Try adjusting your filters.'
              : 'Add products to manage inventory.'}
          </p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((p) => (
            <InventoryCard
              key={p._id}
              product={p}
              onRestock={() => mutate()}
              onSell={(size) => openSale(p, size)}
            />
          ))}
        </div>
      )}

      <SaleLogModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        product={saleProduct}
        presetSize={presetSize}
        onLogged={() => mutate()}
      />
    </div>
  );
}
