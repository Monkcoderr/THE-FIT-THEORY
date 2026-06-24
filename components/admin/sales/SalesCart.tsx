'use client';

import { Minus, Plus, Trash2, ShoppingCart } from 'lucide-react';
import type { PaymentMethod } from '@/types';
import { cn, formatPrice } from '@/lib/utils';
import { CartLine, cartSubtotal, lineKey } from './cart';

const PAYMENT_METHODS: PaymentMethod[] = ['Cash', 'UPI', 'Card', 'Other'];

interface SalesCartProps {
  lines: CartLine[];
  finalPrice: string;
  paymentMethod: PaymentMethod;
  submitting: boolean;
  canSubmit: boolean;
  onQty: (key: string, quantity: number) => void;
  onPrice: (key: string, price: number) => void;
  onRemove: (key: string) => void;
  onFinalPrice: (value: string) => void;
  onPayment: (method: PaymentMethod) => void;
  onSubmit: () => void;
}

export default function SalesCart({
  lines,
  finalPrice,
  paymentMethod,
  submitting,
  canSubmit,
  onQty,
  onPrice,
  onRemove,
  onFinalPrice,
  onPayment,
  onSubmit,
}: SalesCartProps) {
  const subtotal = cartSubtotal(lines);
  // Staff enters the final price the customer pays; the discount is derived.
  const finalAmount =
    finalPrice === ''
      ? subtotal
      : Math.max(0, Math.min(Number(finalPrice) || 0, subtotal));
  const discountNum = subtotal - finalAmount;

  return (
    <div className="flex flex-col rounded-lg border border-admin-border bg-admin-surface">
      <div className="flex items-center gap-2 border-b border-admin-border p-4">
        <ShoppingCart className="h-4 w-4 text-admin-text-soft" />
        <h3 className="text-sm font-semibold text-admin-text">Cart</h3>
        <span className="ml-auto text-xs text-admin-mute">
          {lines.length} item{lines.length === 1 ? '' : 's'}
        </span>
      </div>

      {lines.length === 0 ? (
        <p className="px-4 py-10 text-center text-sm text-admin-mute">
          Search products and tap a size to add them here.
        </p>
      ) : (
        <ul className="divide-y divide-admin-border">
          {lines.map((l) => {
            const key = lineKey(l.productId, l.size);
            return (
              <li key={key} className="p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-admin-text">
                      {l.productName}
                    </p>
                    <p className="text-xs text-admin-mute">
                      Size {l.size} · MRP {formatPrice(l.mrp)} · {l.maxStock} in
                      stock
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onRemove(key)}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-admin-mute transition-colors hover:bg-admin-red/10 hover:text-admin-red"
                    aria-label={`Remove ${l.productName}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-2.5 flex items-center justify-between gap-3">
                  {/* Quantity stepper */}
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => onQty(key, l.quantity - 1)}
                      disabled={l.quantity <= 1}
                      className="flex h-9 w-9 items-center justify-center rounded-md border border-admin-border bg-admin-surface-2 text-admin-text disabled:opacity-40"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-7 text-center text-sm font-semibold text-admin-text">
                      {l.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => onQty(key, l.quantity + 1)}
                      disabled={l.quantity >= l.maxStock}
                      className="flex h-9 w-9 items-center justify-center rounded-md border border-admin-border bg-admin-surface-2 text-admin-text disabled:opacity-40"
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {/* Selling price override */}
                  <label className="flex items-center gap-1.5 text-xs text-admin-mute">
                    <span>₹</span>
                    <input
                      type="number"
                      min={0}
                      value={l.sellingPrice}
                      onChange={(e) =>
                        onPrice(key, Math.max(0, Number(e.target.value)))
                      }
                      className="h-9 w-24 rounded-md border border-admin-border bg-admin-surface-2 px-2 text-right text-sm text-admin-text focus:border-admin-blue focus:outline-none focus:ring-1 focus:ring-admin-blue"
                      aria-label={`Selling price for ${l.productName}`}
                    />
                  </label>
                </div>

                <div className="mt-1.5 text-right text-sm font-medium text-admin-text">
                  {formatPrice(l.sellingPrice * l.quantity)}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {/* Payment method */}
      <div className="border-t border-admin-border p-4">
        <p className="mb-2 text-xs font-medium text-admin-text-soft">
          Payment method
        </p>
        <div className="grid grid-cols-4 gap-1.5">
          {PAYMENT_METHODS.map((pm) => (
            <button
              key={pm}
              type="button"
              onClick={() => onPayment(pm)}
              className={cn(
                'h-9 rounded-md border text-xs font-medium transition-colors',
                paymentMethod === pm
                  ? 'border-admin-blue bg-admin-blue/10 text-admin-blue'
                  : 'border-admin-border bg-admin-surface-2 text-admin-text-soft hover:text-admin-text'
              )}
            >
              {pm}
            </button>
          ))}
        </div>
      </div>

      {/* Totals */}
      <div className="space-y-2 border-t border-admin-border p-4">
        <div className="flex items-center justify-between text-sm text-admin-text-soft">
          <span>Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex items-center justify-between gap-3 text-sm text-admin-text-soft">
          <span>Final price (₹)</span>
          <input
            type="number"
            min={0}
            max={subtotal}
            value={finalPrice}
            onChange={(e) => onFinalPrice(e.target.value)}
            placeholder={String(subtotal)}
            className="h-9 w-28 rounded-md border border-admin-border bg-admin-surface-2 px-2 text-right text-sm text-admin-text focus:border-admin-blue focus:outline-none focus:ring-1 focus:ring-admin-blue"
            aria-label="Final price"
          />
        </div>
        <div className="flex items-center justify-between text-sm text-admin-text-soft">
          <span>Discount</span>
          <span className={discountNum > 0 ? 'text-admin-green' : undefined}>
            {discountNum > 0 ? `- ${formatPrice(discountNum)}` : formatPrice(0)}
          </span>
        </div>
        <div className="flex items-center justify-between border-t border-admin-border pt-2 text-base font-semibold text-admin-text">
          <span>Total</span>
          <span>{formatPrice(finalAmount)}</span>
        </div>

        <button
          type="button"
          onClick={onSubmit}
          disabled={!canSubmit || submitting}
          className="mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-md bg-admin-blue text-sm font-semibold text-white transition-colors hover:bg-admin-blue-hover disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? 'Generating…' : 'Generate Bill'}
        </button>
      </div>
    </div>
  );
}
