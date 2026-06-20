'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, Plus } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import ProductTable from '@/components/admin/ProductTable';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { cn } from '@/lib/utils';

type StatusFilter = 'all' | 'active' | 'draft';

export default function AdminProductsPage() {
  const { products, isLoading, mutate } = useProducts();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = p.title
        .toLowerCase()
        .includes(search.trim().toLowerCase());
      const matchesStatus =
        statusFilter === 'all' || p.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [products, search, statusFilter]);

  const tabs: { key: StatusFilter; label: string; count: number }[] = [
    { key: 'all', label: 'All', count: products.length },
    {
      key: 'active',
      label: 'Active',
      count: products.filter((p) => p.status === 'active').length,
    },
    {
      key: 'draft',
      label: 'Drafts',
      count: products.filter((p) => p.status === 'draft').length,
    },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-admin-text">Products</h2>
          <p className="text-sm text-admin-mute">
            Manage your catalog, stock, and visibility.
          </p>
        </div>
        <Link href="/admin/products/new" className="hidden sm:block">
          <Button variant="primary">
            <Plus className="h-4 w-4" /> New Product
          </Button>
        </Link>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-1 rounded-md border border-admin-border bg-admin-surface p-1">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setStatusFilter(t.key)}
              className={cn(
                'inline-flex h-9 items-center gap-1.5 rounded px-3 text-sm font-medium transition-colors',
                statusFilter === t.key
                  ? 'bg-admin-surface-2 text-admin-text'
                  : 'text-admin-text-soft hover:text-admin-text'
              )}
            >
              {t.label}
              <span className="text-xs text-admin-mute">{t.count}</span>
            </button>
          ))}
        </div>

        <div className="sm:w-72">
          <Input
            placeholder="Search products…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftElement={<Search className="h-4 w-4 text-admin-mute" />}
          />
        </div>
      </div>

      <ProductTable
        products={filtered}
        isLoading={isLoading}
        onChanged={() => mutate()}
      />
    </div>
  );
}
