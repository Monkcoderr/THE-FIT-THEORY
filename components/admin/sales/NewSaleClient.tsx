'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import type { CreateInvoicePayload, Invoice, PaymentMethod, Product } from '@/types';
import { useProducts } from '@/hooks/useProducts';
import { isValidMobile } from '@/lib/invoice';
import { toast } from '@/components/ui/Toast';
import ProductSearchPanel from './ProductSearchPanel';
import SalesCart from './SalesCart';
import CustomerForm from './CustomerForm';
import InvoicePreview from './InvoicePreview';
import { CartLine, cartSubtotal, lineKey, makeCartLine } from './cart';

export default function NewSaleClient() {
  const router = useRouter();
  const { products, isLoading, mutate: mutateProducts } = useProducts();

  const [lines, setLines] = useState<CartLine[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [customerMobile, setCustomerMobile] = useState('');
  const [finalPrice, setFinalPrice] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash');
  const [submitting, setSubmitting] = useState(false);

  const [createdInvoice, setCreatedInvoice] = useState<Invoice | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  const inCart = useMemo(() => {
    const map: Record<string, number> = {};
    for (const l of lines) map[lineKey(l.productId, l.size)] = l.quantity;
    return map;
  }, [lines]);

  function addToCart(product: Product, size: string) {
    const key = lineKey(product._id, size);
    setLines((prev) => {
      const existing = prev.find(
        (l) => lineKey(l.productId, l.size) === key
      );
      if (existing) {
        if (existing.quantity >= existing.maxStock) return prev;
        return prev.map((l) =>
          lineKey(l.productId, l.size) === key
            ? { ...l, quantity: l.quantity + 1 }
            : l
        );
      }
      return [...prev, makeCartLine(product, size)];
    });
  }

  function setQty(key: string, quantity: number) {
    setLines((prev) =>
      prev.map((l) => {
        if (lineKey(l.productId, l.size) !== key) return l;
        const clamped = Math.max(1, Math.min(l.maxStock, quantity));
        return { ...l, quantity: clamped };
      })
    );
  }

  function setPrice(key: string, price: number) {
    setLines((prev) =>
      prev.map((l) =>
        lineKey(l.productId, l.size) === key
          ? { ...l, sellingPrice: price }
          : l
      )
    );
  }

  function removeLine(key: string) {
    setLines((prev) => prev.filter((l) => lineKey(l.productId, l.size) !== key));
  }

  const canSubmit = lines.length > 0 && isValidMobile(customerMobile);

  async function generateBill() {
    if (lines.length === 0) {
      toast.error('Add at least one product');
      return;
    }
    if (!isValidMobile(customerMobile)) {
      toast.error('Enter a valid 10-digit mobile number');
      return;
    }

    const subtotal = cartSubtotal(lines);
    const finalAmount =
      finalPrice === ''
        ? subtotal
        : Math.max(0, Math.min(Number(finalPrice) || 0, subtotal));

    const payload: CreateInvoicePayload = {
      customerName: customerName.trim() || undefined,
      customerMobile,
      items: lines.map((l) => ({
        productId: l.productId,
        size: l.size,
        quantity: l.quantity,
        sellingPrice: l.sellingPrice,
      })),
      discountAmount: subtotal - finalAmount,
      paymentMethod,
    };

    setSubmitting(true);
    try {
      const res = await fetch('/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? 'Failed to generate bill');
        return;
      }
      toast.success(`Invoice ${data.invoice.invoiceNumber} created`);
      setCreatedInvoice(data.invoice as Invoice);
      setPreviewOpen(true);
      // Reset the cart for the next sale; stock changed, so refresh products.
      setLines([]);
      setCustomerName('');
      setCustomerMobile('');
      setFinalPrice('');
      setPaymentMethod('Cash');
      mutateProducts();
    } catch {
      toast.error('Network error');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/sales"
          className="flex h-9 w-9 items-center justify-center rounded-md border border-admin-border bg-admin-surface text-admin-text-soft transition-colors hover:text-admin-text"
          aria-label="Back to Sales Log"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h2 className="text-xl font-semibold text-admin-text">New Sale</h2>
          <p className="text-sm text-admin-mute">
            Search products, build the cart, and bill the customer.
          </p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_400px]">
        {/* Left: product search */}
        <div className="order-2 lg:order-1 lg:h-[calc(100vh-220px)]">
          <ProductSearchPanel
            products={products}
            isLoading={isLoading}
            inCart={inCart}
            onAdd={addToCart}
          />
        </div>

        {/* Right: customer + cart */}
        <div className="order-1 space-y-4 lg:order-2">
          <div className="rounded-lg border border-admin-border bg-admin-surface p-4">
            <h3 className="mb-3 text-sm font-semibold text-admin-text">
              Customer
            </h3>
            <CustomerForm
              customerName={customerName}
              customerMobile={customerMobile}
              onChange={({ customerName: n, customerMobile: m }) => {
                setCustomerName(n);
                setCustomerMobile(m);
              }}
            />
          </div>

          <SalesCart
            lines={lines}
            finalPrice={finalPrice}
            paymentMethod={paymentMethod}
            submitting={submitting}
            canSubmit={canSubmit}
            onQty={setQty}
            onPrice={setPrice}
            onRemove={removeLine}
            onFinalPrice={setFinalPrice}
            onPayment={setPaymentMethod}
            onSubmit={generateBill}
          />
        </div>
      </div>

      <InvoicePreview
        open={previewOpen}
        onOpenChange={(o) => {
          setPreviewOpen(o);
          if (!o) router.push('/admin/sales');
        }}
        invoice={createdInvoice}
        heading="Sale complete 🎉"
      />
    </div>
  );
}
