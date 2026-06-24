'use client';

import { MessageCircle, X } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import type { Invoice } from '@/types';
import { cn, formatPrice } from '@/lib/utils';
import { STORE, formatStorePhone } from '@/lib/store';
import { generateInvoiceWhatsAppURL } from '@/lib/whatsapp';

interface InvoicePreviewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoice: Invoice | null;
  /** Heading shown above the invoice (e.g. success message after billing). */
  heading?: string;
  /** Called when the staff taps "Send via WhatsApp" (for resend auditing). */
  onShare?: (invoice: Invoice) => void;
}

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function InvoicePreview({
  open,
  onOpenChange,
  invoice,
  heading,
  onShare,
}: InvoicePreviewProps) {
  if (!invoice) return null;

  function handleShare() {
    if (!invoice) return;
    onShare?.(invoice);
    const url = generateInvoiceWhatsAppURL(invoice);
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  const cancelled = invoice.status === 'cancelled';

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 animate-fade-in bg-black/70 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 flex max-h-[90vh] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 animate-scale-in flex-col overflow-hidden rounded-lg border border-admin-border bg-admin-surface text-admin-text shadow-2xl focus:outline-none">
          <div className="flex items-start justify-between gap-4 border-b border-admin-border p-5">
            <div>
              <Dialog.Title className="text-lg font-semibold text-admin-text">
                {heading ?? 'Invoice'}
              </Dialog.Title>
              <Dialog.Description className="mt-0.5 text-sm text-admin-text-soft">
                {invoice.invoiceNumber} · {formatDateTime(invoice.createdAt)}
              </Dialog.Description>
            </div>
            <Dialog.Close
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-admin-text-soft transition-colors hover:bg-admin-surface-2 hover:text-admin-text"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </Dialog.Close>
          </div>

          <div className="admin-scroll flex-1 overflow-y-auto p-5">
            {cancelled && (
              <div className="mb-4 rounded-md border border-admin-red/20 bg-admin-red/10 px-3 py-2 text-sm font-medium text-admin-red">
                This sale has been cancelled.
              </div>
            )}

            {/* Store + customer */}
            <div className="flex flex-wrap justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-admin-text">
                  {STORE.name}
                </p>
                <p className="text-xs text-admin-mute">{STORE.tagline}</p>
                {formatStorePhone() && (
                  <p className="text-xs text-admin-mute">
                    {formatStorePhone()}
                  </p>
                )}
              </div>
              <div className="text-right">
                <p className="text-xs text-admin-mute">Billed to</p>
                <p className="text-sm font-medium text-admin-text">
                  {invoice.customerName || 'Walk-in customer'}
                </p>
                <p className="text-xs text-admin-mute">
                  {invoice.customerMobile}
                </p>
              </div>
            </div>

            {/* Items */}
            <div className="mt-4 overflow-hidden rounded-md border border-admin-border">
              <table className="w-full text-sm">
                <thead className="bg-admin-surface-2 text-xs text-admin-text-soft">
                  <tr>
                    <th className="px-3 py-2 text-left font-medium">Item</th>
                    <th className="px-2 py-2 text-right font-medium">Qty</th>
                    <th className="px-2 py-2 text-right font-medium">Price</th>
                    <th className="px-3 py-2 text-right font-medium">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((it, i) => (
                    <tr
                      key={`${it.productId ?? 'x'}-${it.size}-${i}`}
                      className="border-t border-admin-border"
                    >
                      <td className="px-3 py-2 text-admin-text">
                        {it.productName}{' '}
                        <span className="text-admin-mute">({it.size})</span>
                      </td>
                      <td className="px-2 py-2 text-right text-admin-text-soft">
                        {it.quantity}
                      </td>
                      <td className="px-2 py-2 text-right text-admin-text-soft">
                        {formatPrice(it.sellingPrice)}
                      </td>
                      <td className="px-3 py-2 text-right text-admin-text">
                        {formatPrice(it.totalPrice)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="ml-auto mt-3 w-full max-w-[260px] space-y-1 text-sm">
              <div className="flex justify-between text-admin-text-soft">
                <span>Subtotal</span>
                <span>{formatPrice(invoice.subtotal)}</span>
              </div>
              {invoice.discountAmount > 0 && (
                <div className="flex justify-between text-admin-text-soft">
                  <span>Discount</span>
                  <span>- {formatPrice(invoice.discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-admin-border pt-2 text-base font-semibold text-admin-text">
                <span>Total</span>
                <span>{formatPrice(invoice.finalAmount)}</span>
              </div>
              <div className="flex justify-between pt-1 text-xs text-admin-mute">
                <span>Payment</span>
                <span>{invoice.paymentMethod}</span>
              </div>
            </div>

            {invoice.note && (
              <p className="mt-4 rounded-md bg-admin-surface-2 p-2.5 text-xs text-admin-text-soft">
                Note: {invoice.note}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2 border-t border-admin-border p-4 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={handleShare}
              className={cn(
                'inline-flex h-11 items-center justify-center gap-2 rounded-md px-4 text-sm font-semibold text-black transition-colors',
                'bg-admin-green hover:opacity-90'
              )}
            >
              <MessageCircle className="h-4 w-4" />
              Send via WhatsApp
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
