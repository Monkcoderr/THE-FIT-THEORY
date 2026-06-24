'use client';

import { useMemo, useState } from 'react';
import {
  Search,
  Eye,
  MessageCircle,
  Pencil,
  Ban,
  Receipt,
} from 'lucide-react';
import type { Invoice } from '@/types';
import { useInvoices, InvoiceQuery } from '@/hooks/useInvoices';
import { cn, formatPrice } from '@/lib/utils';
import { generateInvoiceWhatsAppURL } from '@/lib/whatsapp';
import Input from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';
import Skeleton from '@/components/ui/Skeleton';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { toast } from '@/components/ui/Toast';
import InvoicePreview from './InvoicePreview';
import EditInvoiceModal from './EditInvoiceModal';

type DatePreset = 'all' | 'today' | 'week' | 'month' | 'custom';

function ymd(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function daysAgoYmd(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return ymd(d);
}

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function SalesLogClient() {
  const [search, setSearch] = useState('');
  const [preset, setPreset] = useState<DatePreset>('all');
  const [customFrom, setCustomFrom] = useState('');
  const [customTo, setCustomTo] = useState('');
  const [statusFilter, setStatusFilter] = useState<
    'all' | 'completed' | 'cancelled'
  >('all');

  const [viewInvoice, setViewInvoice] = useState<Invoice | null>(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [editInvoice, setEditInvoice] = useState<Invoice | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [cancelTarget, setCancelTarget] = useState<Invoice | null>(null);
  const [cancelling, setCancelling] = useState(false);

  const query = useMemo<InvoiceQuery>(() => {
    const q: InvoiceQuery = { limit: 100 };
    if (search.trim()) q.search = search.trim();
    if (statusFilter !== 'all') q.status = statusFilter;
    if (preset === 'today') {
      q.from = ymd(new Date());
      q.to = ymd(new Date());
    } else if (preset === 'week') {
      q.from = daysAgoYmd(6);
      q.to = ymd(new Date());
    } else if (preset === 'month') {
      q.from = daysAgoYmd(29);
      q.to = ymd(new Date());
    } else if (preset === 'custom') {
      if (customFrom) q.from = customFrom;
      if (customTo) q.to = customTo;
    }
    return q;
  }, [search, preset, statusFilter, customFrom, customTo]);

  const { invoices, isLoading, mutate } = useInvoices(query);

  const totalRevenue = useMemo(
    () =>
      invoices
        .filter((i) => i.status === 'completed')
        .reduce((s, i) => s + i.finalAmount, 0),
    [invoices]
  );

  function openView(inv: Invoice) {
    setViewInvoice(inv);
    setViewOpen(true);
  }

  function openEdit(inv: Invoice) {
    setEditInvoice(inv);
    setEditOpen(true);
  }

  async function resend(inv: Invoice) {
    // Log the resend (best-effort), then open WhatsApp pre-filled.
    try {
      await fetch(`/api/invoices/${inv._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'resend' }),
      });
    } catch {
      /* non-blocking */
    }
    window.open(
      generateInvoiceWhatsAppURL(inv),
      '_blank',
      'noopener,noreferrer'
    );
  }

  async function confirmCancel() {
    if (!cancelTarget) return;
    setCancelling(true);
    try {
      const res = await fetch(`/api/invoices/${cancelTarget._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? 'Failed to cancel sale');
        return;
      }
      toast.success('Sale cancelled · stock restored');
      setCancelTarget(null);
      mutate();
    } catch {
      toast.error('Network error');
    } finally {
      setCancelling(false);
    }
  }

  const presets: { key: DatePreset; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'today', label: 'Today' },
    { key: 'week', label: 'This week' },
    { key: 'month', label: 'This month' },
    { key: 'custom', label: 'Custom' },
  ];

  return (
    <div className="space-y-4">
      {/* Filter bar */}
      <div className="space-y-3 rounded-lg border border-admin-border bg-admin-surface p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-1 rounded-md border border-admin-border bg-admin-bg p-1">
            {presets.map((p) => (
              <button
                key={p.key}
                onClick={() => setPreset(p.key)}
                className={cn(
                  'h-9 rounded px-3 text-sm font-medium transition-colors',
                  preset === p.key
                    ? 'bg-admin-surface-2 text-admin-text'
                    : 'text-admin-text-soft hover:text-admin-text'
                )}
              >
                {p.label}
              </button>
            ))}
          </div>
          <div className="lg:w-80">
            <Input
              placeholder="Search invoice #, mobile, name, product…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              leftElement={<Search className="h-4 w-4 text-admin-mute" />}
            />
          </div>
        </div>

        {preset === 'custom' && (
          <div className="flex flex-wrap items-end gap-3">
            <div>
              <label className="mb-1 block text-xs text-admin-mute">From</label>
              <input
                type="date"
                value={customFrom}
                onChange={(e) => setCustomFrom(e.target.value)}
                className="h-10 rounded-md border border-admin-border bg-admin-surface-2 px-3 text-sm text-admin-text focus:border-admin-blue focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-admin-mute">To</label>
              <input
                type="date"
                value={customTo}
                onChange={(e) => setCustomTo(e.target.value)}
                className="h-10 rounded-md border border-admin-border bg-admin-surface-2 px-3 text-sm text-admin-text focus:border-admin-blue focus:outline-none"
              />
            </div>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-1 rounded-md border border-admin-border bg-admin-bg p-1">
            {(['all', 'completed', 'cancelled'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={cn(
                  'h-8 rounded px-3 text-xs font-medium capitalize transition-colors',
                  statusFilter === s
                    ? 'bg-admin-surface-2 text-admin-text'
                    : 'text-admin-text-soft hover:text-admin-text'
                )}
              >
                {s}
              </button>
            ))}
          </div>
          <p className="text-sm text-admin-mute">
            {invoices.length} invoice{invoices.length === 1 ? '' : 's'} ·{' '}
            <span className="font-medium text-admin-text">
              {formatPrice(totalRevenue)}
            </span>
          </p>
        </div>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : invoices.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-admin-border bg-admin-surface py-16 text-center">
          <Receipt className="h-10 w-10 text-admin-mute" />
          <p className="mt-3 text-sm font-medium text-admin-text">
            No sales found
          </p>
          <p className="mt-1 text-sm text-admin-mute">
            Adjust filters or create a new sale.
          </p>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden overflow-hidden rounded-lg border border-admin-border bg-admin-surface lg:block">
            <table className="w-full text-sm">
              <thead className="border-b border-admin-border bg-admin-surface-2 text-xs text-admin-text-soft">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Invoice</th>
                  <th className="px-4 py-3 text-left font-medium">Customer</th>
                  <th className="px-4 py-3 text-left font-medium">Items</th>
                  <th className="px-4 py-3 text-right font-medium">Total</th>
                  <th className="px-4 py-3 text-left font-medium">Payment</th>
                  <th className="px-4 py-3 text-left font-medium">Date</th>
                  <th className="px-4 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv) => {
                  const cancelled = inv.status === 'cancelled';
                  const itemCount = inv.items.reduce(
                    (s, it) => s + it.quantity,
                    0
                  );
                  return (
                    <tr
                      key={inv._id}
                      className="border-b border-admin-border-soft last:border-0 hover:bg-admin-surface-2"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-admin-text">
                            {inv.invoiceNumber}
                          </span>
                          {cancelled && (
                            <Badge variant="danger">Cancelled</Badge>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-admin-text">
                          {inv.customerName || 'Walk-in'}
                        </p>
                        <p className="text-xs text-admin-mute">
                          {inv.customerMobile}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-admin-text-soft">
                        {itemCount} ({inv.items.length} line
                        {inv.items.length === 1 ? '' : 's'})
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-admin-text">
                        {formatPrice(inv.finalAmount)}
                      </td>
                      <td className="px-4 py-3 text-admin-text-soft">
                        {inv.paymentMethod}
                      </td>
                      <td className="px-4 py-3 text-admin-text-soft">
                        {formatDateTime(inv.createdAt)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <ActionButton
                            label="View"
                            onClick={() => openView(inv)}
                          >
                            <Eye className="h-4 w-4" />
                          </ActionButton>
                          <ActionButton
                            label="Resend on WhatsApp"
                            onClick={() => resend(inv)}
                            disabled={cancelled}
                          >
                            <MessageCircle className="h-4 w-4" />
                          </ActionButton>
                          <ActionButton
                            label="Edit"
                            onClick={() => openEdit(inv)}
                            disabled={cancelled}
                          >
                            <Pencil className="h-4 w-4" />
                          </ActionButton>
                          <ActionButton
                            label="Cancel sale"
                            onClick={() => setCancelTarget(inv)}
                            disabled={cancelled}
                            danger
                          >
                            <Ban className="h-4 w-4" />
                          </ActionButton>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="space-y-2 lg:hidden">
            {invoices.map((inv) => {
              const cancelled = inv.status === 'cancelled';
              const itemCount = inv.items.reduce(
                (s, it) => s + it.quantity,
                0
              );
              return (
                <div
                  key={inv._id}
                  className="rounded-lg border border-admin-border bg-admin-surface p-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-admin-text">
                          {inv.invoiceNumber}
                        </span>
                        {cancelled && (
                          <Badge variant="danger">Cancelled</Badge>
                        )}
                      </div>
                      <p className="mt-0.5 text-sm text-admin-text-soft">
                        {inv.customerName || 'Walk-in'} · {inv.customerMobile}
                      </p>
                      <p className="text-xs text-admin-mute">
                        {itemCount} item{itemCount === 1 ? '' : 's'} ·{' '}
                        {inv.paymentMethod} · {formatDateTime(inv.createdAt)}
                      </p>
                    </div>
                    <span className="shrink-0 text-base font-semibold text-admin-text">
                      {formatPrice(inv.finalAmount)}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center gap-1.5">
                    <ActionButton label="View" onClick={() => openView(inv)}>
                      <Eye className="h-4 w-4" />
                    </ActionButton>
                    <ActionButton
                      label="Resend"
                      onClick={() => resend(inv)}
                      disabled={cancelled}
                    >
                      <MessageCircle className="h-4 w-4" />
                    </ActionButton>
                    <ActionButton
                      label="Edit"
                      onClick={() => openEdit(inv)}
                      disabled={cancelled}
                    >
                      <Pencil className="h-4 w-4" />
                    </ActionButton>
                    <ActionButton
                      label="Cancel"
                      onClick={() => setCancelTarget(inv)}
                      disabled={cancelled}
                      danger
                    >
                      <Ban className="h-4 w-4" />
                    </ActionButton>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Modals */}
      <InvoicePreview
        open={viewOpen}
        onOpenChange={setViewOpen}
        invoice={viewInvoice}
        onShare={(inv) => {
          // Log resend when shared from the viewer too.
          fetch(`/api/invoices/${inv._id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'resend' }),
          }).catch(() => {});
        }}
      />

      <EditInvoiceModal
        open={editOpen}
        onOpenChange={setEditOpen}
        invoice={editInvoice}
        onSaved={() => mutate()}
      />

      <ConfirmDialog
        open={!!cancelTarget}
        onOpenChange={(o) => !o && setCancelTarget(null)}
        title="Cancel this sale?"
        description={
          cancelTarget
            ? `Invoice ${cancelTarget.invoiceNumber} will be marked cancelled and its stock restored. This cannot be undone.`
            : ''
        }
        confirmLabel="Cancel sale"
        cancelLabel="Keep sale"
        variant="danger"
        loading={cancelling}
        onConfirm={confirmCancel}
      />
    </div>
  );
}

function ActionButton({
  label,
  onClick,
  disabled,
  danger,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={cn(
        'flex h-9 w-9 items-center justify-center rounded-md border border-admin-border bg-admin-surface-2 transition-colors disabled:cursor-not-allowed disabled:opacity-40',
        danger
          ? 'text-admin-text-soft hover:bg-admin-red/10 hover:text-admin-red'
          : 'text-admin-text-soft hover:bg-admin-border hover:text-admin-text'
      )}
    >
      {children}
    </button>
  );
}
