import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { revalidateTag } from 'next/cache';
import { connectToDatabase } from '@/lib/mongodb';
import Product from '@/models/Product';
import Invoice from '@/models/Invoice';
import SaleRecord from '@/models/SaleRecord';
import { getSessionFromCookies } from '@/lib/auth';
import { writeAudit } from '@/lib/audit';
import { isValidMobile, normalizeMobile, distributeDiscount, serializeInvoice } from '@/lib/invoice';
import type { EditInvoicePayload, PaymentMethod } from '@/types';
import { PRODUCTS_TAG } from '@/lib/data';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const PAYMENT_METHODS: PaymentMethod[] = ['Cash', 'UPI', 'Card', 'Other'];

function isValidId(id: string) {
  return mongoose.Types.ObjectId.isValid(id);
}

// GET /api/invoices/[id] — fetch a single invoice (admin only)
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authed = await getSessionFromCookies();
  if (!authed) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = params;
  if (!isValidId(id)) {
    return NextResponse.json({ error: 'Invalid invoice id.' }, { status: 400 });
  }

  try {
    await connectToDatabase();
    const invoice = await Invoice.findById(id).lean();
    if (!invoice) {
      return NextResponse.json(
        { error: 'Invoice not found.' },
        { status: 404 }
      );
    }
    return NextResponse.json({
      invoice: serializeInvoice(invoice),
    });
  } catch (err) {
    console.error('GET /api/invoices/[id] error:', err);
    return NextResponse.json(
      { error: 'Failed to fetch invoice.' },
      { status: 500 }
    );
  }
}

// PATCH /api/invoices/[id] — edit invoice (admin only).
// Editable: customer details, payment method, discount, note. Line items are
// immutable (cancel + re-create to change products). A `resend` action only
// writes an audit entry.
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authed = await getSessionFromCookies();
  if (!authed) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = params;
  if (!isValidId(id)) {
    return NextResponse.json({ error: 'Invalid invoice id.' }, { status: 400 });
  }

  try {
    await connectToDatabase();
    const invoice = await Invoice.findById(id);
    if (!invoice) {
      return NextResponse.json(
        { error: 'Invoice not found.' },
        { status: 404 }
      );
    }

    const body = (await request.json()) as
      | (EditInvoicePayload & { action?: 'resend' });

    // ── Resend: audit-only ──
    if (body.action === 'resend') {
      await writeAudit({
        action: 'invoice.resend',
        entityType: 'Invoice',
        entityId: invoice.invoiceNumber,
        actor: invoice.createdBy,
      });
      return NextResponse.json({
        invoice: serializeInvoice(invoice.toObject()),
      });
    }

    if (invoice.status === 'cancelled') {
      return NextResponse.json(
        { error: 'A cancelled invoice cannot be edited.' },
        { status: 400 }
      );
    }

    const changes: Record<string, unknown> = {};

    if (body.customerMobile !== undefined) {
      if (!isValidMobile(body.customerMobile)) {
        return NextResponse.json(
          { error: 'A valid 10-digit mobile number is required.' },
          { status: 400 }
        );
      }
      invoice.customerMobile = normalizeMobile(body.customerMobile);
      changes.customerMobile = invoice.customerMobile;
    }

    if (body.customerName !== undefined) {
      invoice.customerName = body.customerName.trim() || undefined;
      changes.customerName = invoice.customerName;
    }

    if (body.paymentMethod !== undefined) {
      if (!PAYMENT_METHODS.includes(body.paymentMethod)) {
        return NextResponse.json(
          { error: 'Invalid payment method.' },
          { status: 400 }
        );
      }
      invoice.paymentMethod = body.paymentMethod;
      changes.paymentMethod = body.paymentMethod;
    }

    if (body.note !== undefined) {
      invoice.note = body.note.trim() || undefined;
      changes.note = invoice.note;
    }

    let discountChanged = false;
    if (body.discountAmount !== undefined) {
      const discount = Math.max(
        0,
        Math.min(Number(body.discountAmount) || 0, invoice.subtotal)
      );
      invoice.discountAmount = discount;
      invoice.finalAmount = invoice.subtotal - discount;
      changes.discountAmount = discount;
      discountChanged = true;
    }

    await invoice.save();

    // Keep linked SaleRecords' revenue consistent when discount changed.
    if (discountChanged) {
      const discounted = distributeDiscount(
        invoice.items.map((it) => it.totalPrice),
        invoice.discountAmount
      );
      const records = await SaleRecord.find({ invoiceId: invoice._id }).sort({
        _id: 1,
      });
      // Records were created in item order; realign by index where possible.
      for (let i = 0; i < records.length && i < discounted.length; i++) {
        records[i].revenue = discounted[i];
        await records[i].save();
      }
    }

    await writeAudit({
      action: 'invoice.edit',
      entityType: 'Invoice',
      entityId: invoice.invoiceNumber,
      actor: invoice.createdBy,
      meta: { changes },
    });

    return NextResponse.json({
      invoice: serializeInvoice(invoice.toObject()),
    });
  } catch (err) {
    console.error('PATCH /api/invoices/[id] error:', err);
    return NextResponse.json(
      { error: 'Failed to update invoice.' },
      { status: 500 }
    );
  }
}

// DELETE /api/invoices/[id] — cancel a sale (admin only).
// Restores stock, removes linked SaleRecords, and marks the invoice cancelled
// (kept for audit; never hard-deleted).
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authed = await getSessionFromCookies();
  if (!authed) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = params;
  if (!isValidId(id)) {
    return NextResponse.json({ error: 'Invalid invoice id.' }, { status: 400 });
  }

  try {
    await connectToDatabase();
    const invoice = await Invoice.findById(id);
    if (!invoice) {
      return NextResponse.json(
        { error: 'Invoice not found.' },
        { status: 404 }
      );
    }
    if (invoice.status === 'cancelled') {
      return NextResponse.json(
        { error: 'Invoice is already cancelled.' },
        { status: 400 }
      );
    }

    // Restore stock for every line item.
    for (const it of invoice.items) {
      if (!it.productId) continue;
      const product = await Product.findById(it.productId);
      if (!product) continue;
      const variant = product.variants.find((v) => v.size === it.size);
      if (variant) {
        variant.stock += it.quantity;
        await product.save();
      }
    }

    // Remove linked sale records so analytics excludes the cancelled sale.
    await SaleRecord.deleteMany({ invoiceId: invoice._id });

    invoice.status = 'cancelled';
    invoice.cancelledAt = new Date();
    await invoice.save();

    await writeAudit({
      action: 'invoice.cancel',
      entityType: 'Invoice',
      entityId: invoice.invoiceNumber,
      actor: invoice.createdBy,
      meta: { finalAmount: invoice.finalAmount },
    });

    revalidateTag(PRODUCTS_TAG);

    return NextResponse.json({
      invoice: serializeInvoice(invoice.toObject()),
    });
  } catch (err) {
    console.error('DELETE /api/invoices/[id] error:', err);
    return NextResponse.json(
      { error: 'Failed to cancel invoice.' },
      { status: 500 }
    );
  }
}
