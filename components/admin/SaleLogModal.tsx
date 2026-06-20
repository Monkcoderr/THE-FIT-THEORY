'use client';

import { useEffect, useMemo, useState } from 'react';
import { Store, MessageCircle, Minus, Plus } from 'lucide-react';
import type { Product, SaleChannel } from '@/types';
import { cn, formatPrice } from '@/lib/utils';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { toast } from '@/components/ui/Toast';

interface SaleLogModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
  /** Pre-selected size (e.g. the variant whose minus was tapped) */
  presetSize?: string;
  onLogged: () => void;
}

export default function SaleLogModal({
  open,
  onOpenChange,
  product,
  presetSize,
  onLogged,
}: SaleLogModalProps) {
  const [size, setSize] = useState<string>('');
  const [channel, setChannel] = useState<SaleChannel>('Walk-in');
  const [quantity, setQuantity] = useState(1);
  const [revenue, setRevenue] = useState<string>('');
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);

  const availableVariants = useMemo(
    () => product?.variants.filter((v) => v.stock > 0) ?? [],
    [product]
  );

  // Reset / preset whenever the modal opens for a product.
  useEffect(() => {
    if (open && product) {
      const initialSize =
        presetSize && product.variants.some((v) => v.size === presetSize)
          ? presetSize
          : availableVariants[0]?.size ?? '';
      setSize(initialSize);
      setChannel('Walk-in');
      setQuantity(1);
      setRevenue(String(product.price));
      setNote('');
    }
  }, [open, product, presetSize, availableVariants]);

  if (!product) return null;

  const selectedVariant = product.variants.find((v) => v.size === size);
  const maxQty = selectedVariant?.stock ?? 0;

  // Keep revenue synced to qty * price unless manually edited away from default.
  function changeQuantity(next: number) {
    const clamped = Math.max(1, Math.min(maxQty, next));
    setQuantity(clamped);
    setRevenue(String(product!.price * clamped));
  }

  async function handleSubmit() {
    if (!size) {
      toast.error('Select a size');
      return;
    }
    const rev = Number(revenue);
    if (Number.isNaN(rev) || rev < 0) {
      toast.error('Enter a valid revenue amount');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product!._id,
          sizeSold: size,
          channel,
          revenue: rev,
          quantity,
          note,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? 'Failed to log sale');
        setSaving(false);
        return;
      }
      toast.success(`Sale logged · ${formatPrice(rev)}`);
      onLogged();
      onOpenChange(false);
    } catch {
      toast.error('Network error');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Log a sale"
      description={product.title}
      theme="admin"
    >
      <div className="space-y-5">
        {/* Channel */}
        <div>
          <p className="mb-2 text-sm font-medium text-admin-text">Channel</p>
          <div className="grid grid-cols-2 gap-2">
            {(
              [
                { key: 'Walk-in', icon: Store, label: 'Walk-in' },
                { key: 'WhatsApp', icon: MessageCircle, label: 'WhatsApp' },
              ] as const
            ).map(({ key, icon: Icon, label }) => (
              <button
                key={key}
                type="button"
                onClick={() => setChannel(key)}
                className={cn(
                  'flex h-11 items-center justify-center gap-2 rounded-md border text-sm font-medium transition-colors',
                  channel === key
                    ? 'border-admin-blue bg-admin-blue/10 text-admin-blue'
                    : 'border-admin-border bg-admin-surface-2 text-admin-text-soft'
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Size */}
        <div>
          <p className="mb-2 text-sm font-medium text-admin-text">Size sold</p>
          {availableVariants.length === 0 ? (
            <p className="text-sm text-admin-red">
              No stock available on any size.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {product.variants.map((v) => {
                const disabled = v.stock <= 0;
                return (
                  <button
                    key={v.size}
                    type="button"
                    disabled={disabled}
                    onClick={() => {
                      setSize(v.size);
                      setQuantity(1);
                      setRevenue(String(product.price));
                    }}
                    className={cn(
                      'h-10 min-w-[3rem] rounded-md border px-3 text-sm font-medium transition-colors',
                      size === v.size
                        ? 'border-admin-blue bg-admin-blue/10 text-admin-blue'
                        : 'border-admin-border bg-admin-surface-2 text-admin-text-soft',
                      disabled && 'cursor-not-allowed opacity-40'
                    )}
                  >
                    {v.size}
                    <span className="ml-1 text-[10px] text-admin-mute">
                      ({v.stock})
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Quantity */}
        <div>
          <p className="mb-2 text-sm font-medium text-admin-text">Quantity</p>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => changeQuantity(quantity - 1)}
              disabled={quantity <= 1}
              className="flex h-11 w-11 items-center justify-center rounded-md border border-admin-border bg-admin-surface-2 text-admin-text disabled:opacity-40"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="w-10 text-center text-lg font-semibold text-admin-text">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => changeQuantity(quantity + 1)}
              disabled={quantity >= maxQty}
              className="flex h-11 w-11 items-center justify-center rounded-md border border-admin-border bg-admin-surface-2 text-admin-text disabled:opacity-40"
            >
              <Plus className="h-4 w-4" />
            </button>
            <span className="text-xs text-admin-mute">
              {maxQty} available
            </span>
          </div>
        </div>

        {/* Revenue */}
        <div>
          <label className="mb-2 block text-sm font-medium text-admin-text">
            Total revenue (₹)
          </label>
          <input
            type="number"
            min={0}
            value={revenue}
            onChange={(e) => setRevenue(e.target.value)}
            className="h-11 w-full rounded-md border border-admin-border bg-admin-surface-2 px-3 text-sm text-admin-text focus:border-admin-blue focus:outline-none focus:ring-1 focus:ring-admin-blue"
          />
        </div>

        {/* Note */}
        <div>
          <label className="mb-2 block text-sm font-medium text-admin-text">
            Note <span className="text-admin-mute">(optional)</span>
          </label>
          <input
            type="text"
            maxLength={280}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. regular customer, discount applied"
            className="h-11 w-full rounded-md border border-admin-border bg-admin-surface-2 px-3 text-sm text-admin-text placeholder:text-admin-mute focus:border-admin-blue focus:outline-none focus:ring-1 focus:ring-admin-blue"
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            loading={saving}
            disabled={availableVariants.length === 0}
          >
            Log sale
          </Button>
        </div>
      </div>
    </Modal>
  );
}
