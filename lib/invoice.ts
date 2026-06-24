// Pure, client-safe invoice helpers (no DB / server imports here).

import type { InvoiceItem } from '@/types';

/**
 * Validate an Indian mobile number. Accepts optional +91 / 91 prefix and
 * spaces/dashes, then checks the core 10 digits start with 6-9.
 */
export function isValidMobile(raw: string): boolean {
  const digits = normalizeMobile(raw);
  return /^[6-9]\d{9}$/.test(digits);
}

/**
 * Strip everything but digits and reduce to the trailing 10-digit subscriber
 * number (drops a leading 91 / 0 country/trunk prefix when present).
 */
export function normalizeMobile(raw: string): string {
  let digits = (raw ?? '').replace(/\D/g, '');
  if (digits.length > 10) {
    digits = digits.slice(-10);
  }
  return digits;
}

/** Format the invoice number as INV-YYYY-NNNNN. */
export function formatInvoiceNumber(year: number, seq: number): string {
  return `INV-${year}-${String(seq).padStart(5, '0')}`;
}

/**
 * Distribute a flat invoice-level discount across line items proportionally to
 * each line's total, so the per-line discounted amounts sum exactly to
 * (subtotal - discount). The final line absorbs any rounding remainder.
 * Returns the discounted amount for each item (same order as input).
 */
export function distributeDiscount(
  lineTotals: number[],
  discount: number
): number[] {
  const subtotal = lineTotals.reduce((s, t) => s + t, 0);
  if (subtotal <= 0 || discount <= 0) return [...lineTotals];

  const cappedDiscount = Math.min(discount, subtotal);
  const finalTotal = subtotal - cappedDiscount;

  const result: number[] = [];
  let allocated = 0;
  for (let i = 0; i < lineTotals.length; i++) {
    if (i === lineTotals.length - 1) {
      result.push(Math.round((finalTotal - allocated) * 100) / 100);
    } else {
      const share =
        Math.round((lineTotals[i] / subtotal) * finalTotal * 100) / 100;
      result.push(share);
      allocated += share;
    }
  }
  return result;
}

export interface ComputedTotals {
  subtotal: number;
  discountAmount: number;
  finalAmount: number;
}

/** Compute subtotal / final from cart items + a flat discount. */
export function computeTotals(
  items: Pick<InvoiceItem, 'totalPrice'>[],
  discount: number
): ComputedTotals {
  const subtotal = items.reduce((s, it) => s + it.totalPrice, 0);
  const discountAmount = Math.max(0, Math.min(discount || 0, subtotal));
  return {
    subtotal,
    discountAmount,
    finalAmount: subtotal - discountAmount,
  };
}

/**
 * Serialize a lean/hydrated invoice document into a plain JSON-safe object
 * (stringifies ObjectIds). Pure — safe to import anywhere.
 */
export function serializeInvoice<
  T extends { _id: unknown; items?: Array<{ productId?: unknown }> },
>(inv: T) {
  const items = (inv.items ?? []).map((it) => {
    const record = it as Record<string, unknown> & { productId?: unknown };
    return {
      ...record,
      productId: record.productId ? String(record.productId) : null,
    };
  });
  return {
    ...inv,
    _id: String(inv._id),
    items,
  };
}
