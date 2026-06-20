'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Pencil,
  Trash2,
  ArrowUpDown,
  PackageX,
  Star,
} from 'lucide-react';
import type { Product } from '@/types';
import { cn, formatPrice, STOCK_CONFIG } from '@/lib/utils';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import Skeleton from '@/components/ui/Skeleton';
import { toast } from '@/components/ui/Toast';

interface ProductTableProps {
  products: Product[];
  isLoading: boolean;
  onChanged: () => void;
}

type SortKey = 'title' | 'price' | 'totalStock' | 'createdAt';
type SortDir = 'asc' | 'desc';

export default function ProductTable({
  products,
  isLoading,
  onChanged,
}: ProductTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('createdAt');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);

  const sorted = useMemo(() => {
    const arr = [...products];
    arr.sort((a, b) => {
      let cmp = 0;
      if (sortKey === 'title') cmp = a.title.localeCompare(b.title);
      else if (sortKey === 'price') cmp = a.price - b.price;
      else if (sortKey === 'totalStock') cmp = a.totalStock - b.totalStock;
      else cmp = a.createdAt.localeCompare(b.createdAt);
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return arr;
  }, [products, sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/products/${deleteTarget._id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        toast.error(data.error ?? 'Delete failed');
      } else {
        toast.success('Product deleted');
        onChanged();
      }
    } catch {
      toast.error('Network error');
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-admin-border bg-admin-surface py-16 text-center">
        <PackageX className="h-10 w-10 text-admin-mute" />
        <h3 className="mt-3 text-sm font-medium text-admin-text">
          No products yet
        </h3>
        <p className="mt-1 max-w-xs text-sm text-admin-mute">
          Create your first product to start building the catalog.
        </p>
        <Link href="/admin/products/new" className="mt-4">
          <Button variant="primary" size="sm">
            Add product
          </Button>
        </Link>
      </div>
    );
  }

  const SortHeader = ({ label, k }: { label: string; k: SortKey }) => (
    <button
      onClick={() => toggleSort(k)}
      className="inline-flex items-center gap-1 font-medium text-admin-text-soft transition-colors hover:text-admin-text"
    >
      {label}
      <ArrowUpDown
        className={cn(
          'h-3 w-3',
          sortKey === k ? 'text-admin-blue' : 'opacity-40'
        )}
      />
    </button>
  );

  return (
    <>
      {/* Desktop table */}
      <div className="hidden overflow-hidden rounded-lg border border-admin-border md:block">
        <table className="w-full text-sm">
          <thead className="bg-admin-surface-2">
            <tr className="text-left">
              <th className="px-4 py-3 font-medium text-admin-text-soft">
                Product
              </th>
              <th className="px-4 py-3">
                <SortHeader label="Price" k="price" />
              </th>
              <th className="px-4 py-3">
                <SortHeader label="Stock" k="totalStock" />
              </th>
              <th className="px-4 py-3 font-medium text-admin-text-soft">
                Status
              </th>
              <th className="px-4 py-3 text-right font-medium text-admin-text-soft">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-admin-border">
            {sorted.map((p) => {
              const sc = STOCK_CONFIG[p.stockStatus];
              return (
                <tr
                  key={p._id}
                  className="bg-admin-surface transition-colors hover:bg-admin-surface-2"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md bg-admin-surface-2">
                        {p.images[0] && (
                          <Image
                            src={p.images[0]}
                            alt={p.title}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="truncate font-medium text-admin-text">
                            {p.title}
                          </span>
                          {p.featured && (
                            <Star className="h-3 w-3 shrink-0 fill-admin-amber text-admin-amber" />
                          )}
                        </div>
                        <span className="text-xs text-admin-mute">
                          {p.category} · {p.fabric}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-admin-text">
                    {formatPrice(p.price)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="inline-flex items-center gap-1.5 text-admin-text"
                      style={{ color: sc.adminColor }}
                    >
                      <span
                        className="h-1.5 w-1.5 rounded-full"
                        style={{ backgroundColor: sc.adminColor }}
                      />
                      {p.totalStock}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      variant={p.status === 'active' ? 'success' : 'default'}
                    >
                      {p.status === 'active' ? 'Active' : 'Draft'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Link href={`/admin/products/${p._id}/edit`}>
                        <button
                          className="flex h-9 w-9 items-center justify-center rounded-md text-admin-text-soft hover:bg-admin-border hover:text-admin-text"
                          aria-label="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                      </Link>
                      <button
                        onClick={() => setDeleteTarget(p)}
                        className="flex h-9 w-9 items-center justify-center rounded-md text-admin-text-soft hover:bg-admin-red/10 hover:text-admin-red"
                        aria-label="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="space-y-2 md:hidden">
        {sorted.map((p) => {
          const sc = STOCK_CONFIG[p.stockStatus];
          return (
            <div
              key={p._id}
              className="flex items-center gap-3 rounded-lg border border-admin-border bg-admin-surface p-3"
            >
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md bg-admin-surface-2">
                {p.images[0] && (
                  <Image
                    src={p.images[0]}
                    alt={p.title}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-admin-text">
                  {p.title}
                </p>
                <p className="text-xs text-admin-mute">
                  {formatPrice(p.price)}
                </p>
                <div className="mt-1 flex items-center gap-2">
                  <Badge
                    variant={p.status === 'active' ? 'success' : 'default'}
                  >
                    {p.status === 'active' ? 'Active' : 'Draft'}
                  </Badge>
                  <span
                    className="inline-flex items-center gap-1 text-xs"
                    style={{ color: sc.adminColor }}
                  >
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ backgroundColor: sc.adminColor }}
                    />
                    {p.totalStock} in stock
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <Link href={`/admin/products/${p._id}/edit`}>
                  <button
                    className="flex h-9 w-9 items-center justify-center rounded-md text-admin-text-soft hover:bg-admin-border"
                    aria-label="Edit"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                </Link>
                <button
                  onClick={() => setDeleteTarget(p)}
                  className="flex h-9 w-9 items-center justify-center rounded-md text-admin-text-soft hover:bg-admin-red/10 hover:text-admin-red"
                  aria-label="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        title="Delete product?"
        description={`"${deleteTarget?.title}" will be permanently removed. Sales history is preserved.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        loading={deleting}
        variant="danger"
      />
    </>
  );
}
