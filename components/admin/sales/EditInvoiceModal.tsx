'use client';

import { useEffect, useState } from 'react';
import type { EditInvoicePayload, Invoice, PaymentMethod } from '@/types';
import { isValidMobile } from '@/lib/invoice';
import { cn, formatPrice } from '@/lib/utils';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { toast } from '@/components/ui/Toast';

const PAYMENT_METHODS: PaymentMethod[] = ['Cash', 'UPI', 'Card', 'Other'];

interface EditInvoiceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoice: Invoice | null;
  onSaved: (updated: Invoice) => void;
}

export default function EditInvoiceModal({
  open,
  onOpenChange,
  invoice,
  onSaved,
}: EditInvoiceModalProps) {
  const [customerName, setCustomerName] = useState('');
  const [customerMobile, setCustomerMobile] = useState('');
  const [finalPrice, setFinalPrice] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash');
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open && invoice) {
      setCustomerName(invoice.customerName ?? '');
      setCustomerMobile(invoice.customerMobile);
      setFinalPrice(String(invoice.finalAmount));
      setPaymentMethod(invoice.paymentMethod);
      setNote(invoice.note ?? '');
    }
  }, [open, invoice]);

  if (!invoice) return null;

  const finalAmount =
    finalPrice === ''
      ? invoice.subtotal
      : Math.max(0, Math.min(Number(finalPrice) || 0, invoice.subtotal));
  const discountNum = invoice.subtotal - finalAmount;

  async function handleSave() {
    if (!invoice) return;
    if (!isValidMobile(customerMobile)) {
      toast.error('Enter a valid 10-digit mobile number');
      return;
    }

    const payload: EditInvoicePayload = {
      customerName,
      customerMobile,
      discountAmount: discountNum,
      paymentMethod,
      note,
    };
    setSaving(true);
    try {
      const res = await fetch(`/api/invoices/${invoice._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? 'Failed to update invoice');
        return;
      }
      toast.success('Invoice updated');
      onSaved(data.invoice as Invoice);
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
      title="Edit sale"
      description={`${invoice.invoiceNumber} · items can't be changed`}
      theme="admin"
    >
      <div className="space-y-4">
        <Input
          label="Mobile number"
          inputMode="numeric"
          value={customerMobile}
          onChange={(e) =>
            setCustomerMobile(e.target.value.replace(/[^\d+\s-]/g, ''))
          }
          error={
            customerMobile && !isValidMobile(customerMobile)
              ? 'Enter a valid 10-digit number'
              : undefined
          }
        />
        <Input
          label="Customer name (optional)"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
        />

        <div>
          <p className="mb-2 text-sm font-medium text-admin-text">
            Payment method
          </p>
          <div className="grid grid-cols-4 gap-1.5">
            {PAYMENT_METHODS.map((pm) => (
              <button
                key={pm}
                type="button"
                onClick={() => setPaymentMethod(pm)}
                className={cn(
                  'h-10 rounded-md border text-xs font-medium transition-colors',
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

        <div>
          <label className="mb-1.5 block text-sm font-medium text-admin-text">
            Final price (₹)
          </label>
          <input
            type="number"
            min={0}
            max={invoice.subtotal}
            value={finalPrice}
            onChange={(e) => setFinalPrice(e.target.value)}
            placeholder={String(invoice.subtotal)}
            className="h-11 w-full rounded-md border border-admin-border bg-admin-surface-2 px-3 text-sm text-admin-text focus:border-admin-blue focus:outline-none focus:ring-1 focus:ring-admin-blue"
          />
          <div className="mt-2 flex items-center justify-between text-sm">
            <span className="text-admin-text-soft">
              Subtotal {formatPrice(invoice.subtotal)}
            </span>
            <span
              className={
                discountNum > 0 ? 'text-admin-green' : 'text-admin-text-soft'
              }
            >
              {discountNum > 0
                ? `Discount - ${formatPrice(discountNum)}`
                : 'No discount'}
            </span>
          </div>
        </div>

        <Input
          label="Note (optional)"
          value={note}
          maxLength={280}
          onChange={(e) => setNote(e.target.value)}
        />

        <div className="flex justify-end gap-2 pt-1">
          <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={saving}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave} loading={saving}>
            Save changes
          </Button>
        </div>
      </div>
    </Modal>
  );
}
