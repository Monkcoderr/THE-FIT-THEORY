'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Save } from 'lucide-react';
import { cn, CATEGORIES, FABRICS, FITS, SPORTS, SIZES } from '@/lib/utils';
import type {
  Category,
  Fabric,
  Fit,
  Sport,
  Size,
  Product,
  ProductStatus,
} from '@/types';
import ImageUploader from './ImageUploader';
import Input from '@/components/ui/Input';
import Toggle from '@/components/ui/Toggle';
import Button from '@/components/ui/Button';
import { toast } from '@/components/ui/Toast';

interface ProductUploadFormProps {
  initial?: Product;
  mode: 'create' | 'edit';
}

type VariantState = Record<Size, number | null>;

function buildInitialVariants(initial?: Product): VariantState {
  const base = Object.fromEntries(SIZES.map((s) => [s, null])) as VariantState;
  initial?.variants.forEach((v) => {
    base[v.size as Size] = v.stock;
  });
  return base;
}

function TagGroup<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: readonly T[];
  value: T | '';
  onChange: (v: T) => void;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-admin-text">
        {label}
      </label>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={cn(
              'h-9 rounded-md border px-3 text-sm font-medium transition-colors',
              value === opt
                ? 'border-admin-blue bg-admin-blue/10 text-admin-blue'
                : 'border-admin-border bg-admin-surface-2 text-admin-text-soft hover:border-admin-text-soft'
            )}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function ProductUploadForm({
  initial,
  mode,
}: ProductUploadFormProps) {
  const router = useRouter();

  const [title, setTitle] = useState(initial?.title ?? '');
  const [price, setPrice] = useState<string>(
    initial ? String(initial.price) : ''
  );
  const [images, setImages] = useState<string[]>(initial?.images ?? []);
  const [category, setCategory] = useState<Category | ''>(
    initial?.category ?? ''
  );
  const [fabric, setFabric] = useState<Fabric | ''>(initial?.fabric ?? '');
  const [fit, setFit] = useState<Fit | ''>(initial?.fit ?? '');
  const [sport, setSport] = useState<Sport | ''>(initial?.sport ?? '');
  const [variants, setVariants] = useState<VariantState>(
    buildInitialVariants(initial)
  );
  const [status, setStatus] = useState<ProductStatus>(
    initial?.status ?? 'draft'
  );
  const [featured, setFeatured] = useState(initial?.featured ?? false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function toggleSize(size: Size) {
    setVariants((prev) => ({
      ...prev,
      [size]: prev[size] === null ? 0 : null,
    }));
  }

  function setStock(size: Size, val: string) {
    const cleaned = val.replace(/^0+(?=\d)/, '');
    const n = cleaned === '' ? 0 : Math.max(0, Math.floor(Number(cleaned)));
    setVariants((prev) => ({ ...prev, [size]: Number.isNaN(n) ? 0 : n }));
  }

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (!title.trim()) e.title = 'Title is required';
    if (!price || Number(price) <= 0) e.price = 'Enter a valid price';
    if (images.length === 0) e.images = 'Upload at least one image';
    if (!category) e.category = 'Select a category';
    if (!fabric) e.fabric = 'Select a fabric';
    if (!fit) e.fit = 'Select a fit';
    if (!sport) e.sport = 'Select a sport';
    const activeVariants = SIZES.filter((s) => variants[s] !== null);
    if (activeVariants.length === 0) e.variants = 'Add at least one size';
    setErrors(e);
    if (Object.keys(e).length) {
      toast.error('Please fix the highlighted fields');
      return false;
    }
    return true;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      title: title.trim(),
      price: Number(price),
      images,
      category,
      fabric,
      fit,
      sport,
      variants: SIZES.filter((s) => variants[s] !== null).map((s) => ({
        size: s,
        stock: variants[s] ?? 0,
      })),
      status,
      featured,
    };

    setSaving(true);
    try {
      const url =
        mode === 'create'
          ? '/api/products'
          : `/api/products/${initial?._id}`;
      const method = mode === 'create' ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error ?? 'Save failed');
        setSaving(false);
        return;
      }

      toast.success(
        mode === 'create' ? 'Product created' : 'Product updated'
      );
      router.push('/admin/products');
      router.refresh();
    } catch {
      toast.error('Network error. Please try again.');
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-24">
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left column */}
        <div className="space-y-6">
          <div className="rounded-lg border border-admin-border bg-admin-surface p-5">
            <h2 className="mb-4 text-sm font-semibold text-admin-text">
              Product images
            </h2>
            <ImageUploader value={images} onChange={setImages} />
            {errors.images && (
              <p className="mt-2 text-xs text-admin-red">{errors.images}</p>
            )}
          </div>

          <div className="space-y-4 rounded-lg border border-admin-border bg-admin-surface p-5">
            <h2 className="text-sm font-semibold text-admin-text">Details</h2>
            <Input
              label="Title"
              placeholder="e.g. Pro Dry-Fit Football Jersey"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              error={errors.title}
              maxLength={120}
            />
            <Input
              label="Price (₹)"
              type="number"
              min={0}
              placeholder="0"
              value={price}
              onChange={(e) => setPrice(e.target.value.replace(/^0+(?=\d)/, ''))}
              error={errors.price}
            />
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          <div className="space-y-4 rounded-lg border border-admin-border bg-admin-surface p-5">
            <h2 className="text-sm font-semibold text-admin-text">
              Attributes
            </h2>
            <TagGroup
              label="Category"
              options={CATEGORIES}
              value={category}
              onChange={setCategory}
            />
            {errors.category && (
              <p className="text-xs text-admin-red">{errors.category}</p>
            )}
            <TagGroup
              label="Fabric"
              options={FABRICS}
              value={fabric}
              onChange={setFabric}
            />
            {errors.fabric && (
              <p className="text-xs text-admin-red">{errors.fabric}</p>
            )}
            <TagGroup
              label="Fit"
              options={FITS}
              value={fit}
              onChange={setFit}
            />
            {errors.fit && (
              <p className="text-xs text-admin-red">{errors.fit}</p>
            )}
            <TagGroup
              label="Sport"
              options={SPORTS}
              value={sport}
              onChange={setSport}
            />
            {errors.sport && (
              <p className="text-xs text-admin-red">{errors.sport}</p>
            )}
          </div>

          {/* Variants */}
          <div className="rounded-lg border border-admin-border bg-admin-surface p-5">
            <h2 className="mb-1 text-sm font-semibold text-admin-text">
              Sizes &amp; stock
            </h2>
            <p className="mb-4 text-xs text-admin-mute">
              Tap a size to enable it, then set its stock quantity.
            </p>
            <div className="space-y-2">
              {SIZES.map((size) => {
                const enabled = variants[size] !== null;
                return (
                  <div key={size} className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => toggleSize(size)}
                      className={cn(
                        'h-10 w-24 shrink-0 rounded-md border text-sm font-medium transition-colors',
                        enabled
                          ? 'border-admin-blue bg-admin-blue/10 text-admin-blue'
                          : 'border-admin-border bg-admin-surface-2 text-admin-text-soft'
                      )}
                    >
                      {size}
                    </button>
                    {enabled && (
                      <input
                        type="number"
                        min={0}
                        value={variants[size] !== null ? String(variants[size]) : ''}
                        onChange={(e) => setStock(size, e.target.value)}
                        placeholder="Stock"
                        className="h-10 w-full rounded-md border border-admin-border bg-admin-surface-2 px-3 text-sm text-admin-text focus:border-admin-blue focus:outline-none focus:ring-1 focus:ring-admin-blue"
                      />
                    )}
                  </div>
                );
              })}
            </div>
            {errors.variants && (
              <p className="mt-2 text-xs text-admin-red">{errors.variants}</p>
            )}
          </div>

          {/* Publishing */}
          <div className="space-y-4 rounded-lg border border-admin-border bg-admin-surface p-5">
            <h2 className="text-sm font-semibold text-admin-text">
              Publishing
            </h2>
            <Toggle
              label="Active"
              description="Visible on the storefront"
              checked={status === 'active'}
              onCheckedChange={(c) => setStatus(c ? 'active' : 'draft')}
            />
            <Toggle
              label="Featured"
              description="Show on homepage featured grid"
              checked={featured}
              onCheckedChange={setFeatured}
            />
          </div>
        </div>
      </div>

      {/* Sticky action bar */}
      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-admin-border bg-admin-bg/90 p-4 backdrop-blur-md lg:pl-64">
        <div className="mx-auto flex max-w-vercel items-center justify-end gap-3">
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.push('/admin/products')}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={saving}>
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {mode === 'create' ? 'Create product' : 'Save changes'}
          </Button>
        </div>
      </div>
    </form>
  );
}
