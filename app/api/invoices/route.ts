import { NextRequest, NextResponse } from 'next/server';
import { FilterQuery } from 'mongoose';
import { revalidateTag } from 'next/cache';
import { connectToDatabase } from '@/lib/mongodb';
import Product from '@/models/Product';
import Invoice, { IInvoice, IInvoiceItem } from '@/models/Invoice';
import { nextSequence } from '@/models/Counter';
import SaleRecord from '@/models/SaleRecord';
import { getSessionFromCookies } from '@/lib/auth';
import { writeAudit } from '@/lib/audit';
import { PRODUCTS_TAG } from '@/lib/data';
import {
  formatInvoiceNumber,
  isValidMobile,
  normalizeMobile,
  distributeDiscount,
  serializeInvoice,
} from '@/lib/invoice';
import type {
  CreateInvoicePayload,
  InvoiceItemPayload,
  PaymentMethod,
} from '@/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const PAYMENT_METHODS: PaymentMethod[] = ['Cash', 'UPI', 'Card', 'Other'];

// GET /api/invoices — list with search + date-range filtering (admin only)
export async function GET(request: NextRequest) {
  const authed = await getSessionFromCookies();
  if (!authed) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);

    const query: FilterQuery<IInvoice> = {};

    const status = searchParams.get('status');
    if (status === 'completed' || status === 'cancelled') {
      query.status = status;
    }

    // Date range (ISO date strings or yyyy-mm-dd)
    const from = searchParams.get('from');
    const to = searchParams.get('to');
    if (from || to) {
      query.createdAt = {};
      if (from) (query.createdAt as Record<string, Date>).$gte = new Date(from);
      if (to) {
        const end = new Date(to);
        // If a bare date was passed, include the whole day.
        if (/^\d{4}-\d{2}-\d{2}$/.test(to)) end.setHours(23, 59, 59, 999);
        (query.createdAt as Record<string, Date>).$lte = end;
      }
    }

    // Free-text search across invoice number, mobile, name, product names.
    const search = searchParams.get('search')?.trim();
    if (search) {
      const rx = { $regex: search, $options: 'i' };
      query.$or = [
        { invoiceNumber: rx },
        { customerMobile: rx },
        { customerName: rx },
        { 'items.productName': rx },
      ];
    }

    const limit = Math.min(Number(searchParams.get('limit')) || 50, 200);

    const invoices = await Invoice.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return NextResponse.json({
      invoices: invoices.map((i) => serializeInvoice(i)),
    });
  } catch (err) {
    console.error('GET /api/invoices error:', err);
    return NextResponse.json(
      { error: 'Failed to fetch invoices.' },
      { status: 500 }
    );
  }
}

// POST /api/invoices — create a billed sale (admin only).
// Flow: validate stock for ALL items, generate invoice number, create the
// invoice, then per-line create a SaleRecord (history) and decrement stock.
export async function POST(request: NextRequest) {
  const authed = await getSessionFromCookies();
  if (!authed) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectToDatabase();
    const body = (await request.json()) as CreateInvoicePayload;

    const {
      customerName,
      customerMobile,
      items,
      discountAmount = 0,
      paymentMethod,
      createdBy,
      note,
    } = body;

    // ── Validation ──
    if (!customerMobile || !isValidMobile(customerMobile)) {
      return NextResponse.json(
        { error: 'A valid 10-digit mobile number is required.' },
        { status: 400 }
      );
    }

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'At least one item is required.' },
        { status: 400 }
      );
    }

    if (!PAYMENT_METHODS.includes(paymentMethod)) {
      return NextResponse.json(
        { error: 'Invalid payment method.' },
        { status: 400 }
      );
    }

    // Load all referenced products once.
    const productIds = Array.from(new Set(items.map((it) => it.productId)));
    const products = await Product.find({ _id: { $in: productIds } });
    const productMap = new Map(products.map((p) => [String(p._id), p]));

    // Build line items + validate each line, accumulating required stock per
    // product/size so duplicate lines don't oversell.
    const requiredStock = new Map<string, number>(); // `${pid}:${size}` -> qty
    const lineItems: IInvoiceItem[] = [];

    for (const raw of items as InvoiceItemPayload[]) {
      const qty = Math.floor(Number(raw.quantity));
      const sellingPrice = Number(raw.sellingPrice);

      if (!raw.productId || !raw.size) {
        return NextResponse.json(
          { error: 'Each item needs a product and size.' },
          { status: 400 }
        );
      }
      if (!Number.isFinite(qty) || qty < 1) {
        return NextResponse.json(
          { error: 'Item quantity must be at least 1.' },
          { status: 400 }
        );
      }
      if (!Number.isFinite(sellingPrice) || sellingPrice < 0) {
        return NextResponse.json(
          { error: 'Item selling price is invalid.' },
          { status: 400 }
        );
      }

      const product = productMap.get(String(raw.productId));
      if (!product) {
        return NextResponse.json(
          { error: 'One or more products no longer exist.' },
          { status: 404 }
        );
      }
      const variant = product.variants.find((v) => v.size === raw.size);
      if (!variant) {
        return NextResponse.json(
          { error: `Size ${raw.size} not found on ${product.title}.` },
          { status: 404 }
        );
      }

      const key = `${String(product._id)}:${raw.size}`;
      const needed = (requiredStock.get(key) ?? 0) + qty;
      requiredStock.set(key, needed);
      if (variant.stock < needed) {
        return NextResponse.json(
          {
            error: `Only ${variant.stock} unit(s) in stock for ${product.title} (${raw.size}).`,
          },
          { status: 400 }
        );
      }

      lineItems.push({
        productId: product._id as IInvoiceItem['productId'],
        productName: product.title,
        size: raw.size,
        quantity: qty,
        mrp: product.price,
        sellingPrice,
        costPrice: product.realCost ?? 0,
        totalPrice: sellingPrice * qty,
      });
    }

    const subtotal = lineItems.reduce((s, it) => s + it.totalPrice, 0);
    const discount = Math.max(0, Math.min(Number(discountAmount) || 0, subtotal));
    const finalAmount = subtotal - discount;
    // Profit is snapshotted now and never recomputed from live product prices.
    const totalCost = lineItems.reduce(
      (s, it) => s + it.costPrice * it.quantity,
      0
    );
    const profit = finalAmount - totalCost;

    // ── Invoice number (atomic) ──
    const year = new Date().getFullYear();
    const seq = await nextSequence(`invoice-${year}`);
    const invoiceNumber = formatInvoiceNumber(year, seq);

    // ── Create the invoice (canonical record) ──
    const invoice = await Invoice.create({
      invoiceNumber,
      customerName: customerName?.trim() || undefined,
      customerMobile: normalizeMobile(customerMobile),
      items: lineItems,
      subtotal,
      discountAmount: discount,
      finalAmount,
      totalCost,
      profit,
      paymentMethod,
      status: 'completed',
      createdBy: createdBy?.trim() || 'Admin',
      note: note?.trim() || undefined,
    });

    // ── Per-line: SaleRecord (history) then decrement stock ──
    // Distribute the invoice discount across lines so analytics revenue ties
    // out to finalAmount.
    const discountedLineTotals = distributeDiscount(
      lineItems.map((it) => it.totalPrice),
      discount
    );

    const touchedProducts = new Set<string>();
    for (let i = 0; i < lineItems.length; i++) {
      const it = lineItems[i];
      await SaleRecord.create({
        productId: it.productId,
        productTitle: it.productName,
        sizeSold: it.size,
        channel: 'Walk-in',
        revenue: discountedLineTotals[i],
        quantity: it.quantity,
        costPrice: it.costPrice,
        invoiceId: invoice._id,
        invoiceNumber,
        date: new Date(),
      });

      const product = productMap.get(String(it.productId));
      if (product) {
        const variant = product.variants.find((v) => v.size === it.size);
        if (variant) variant.stock -= it.quantity;
        touchedProducts.add(String(product._id));
      }
    }

    // Persist stock changes (one save per touched product).
    await Promise.all(
      Array.from(touchedProducts).map((pid) => productMap.get(pid)?.save())
    );

    await writeAudit({
      action: 'invoice.create',
      entityType: 'Invoice',
      entityId: invoiceNumber,
      actor: invoice.createdBy,
      meta: { finalAmount, itemCount: lineItems.length },
    });

    revalidateTag(PRODUCTS_TAG);

    return NextResponse.json(
      { invoice: serializeInvoice(invoice.toObject()) },
      { status: 201 }
    );
  } catch (err) {
    console.error('POST /api/invoices error:', err);
    // Surface duplicate invoice-number collisions explicitly.
    if (
      err &&
      typeof err === 'object' &&
      'code' in err &&
      (err as { code?: number }).code === 11000
    ) {
      return NextResponse.json(
        { error: 'Invoice number collision, please retry.' },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to create invoice.' },
      { status: 500 }
    );
  }
}
