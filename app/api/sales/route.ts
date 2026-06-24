import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { connectToDatabase } from '@/lib/mongodb';
import Product from '@/models/Product';
import SaleRecord from '@/models/SaleRecord';
import { getSessionFromCookies } from '@/lib/auth';
import { PRODUCTS_TAG } from '@/lib/data';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// GET /api/sales — recent sales (admin only)
export async function GET(request: NextRequest) {
  const authed = await getSessionFromCookies();
  if (!authed) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const limit = Math.min(Number(searchParams.get('limit')) || 20, 100);

    const sales = await SaleRecord.find().sort({ date: -1 }).limit(limit).lean();
    return NextResponse.json({
      sales: sales.map((s) => ({ ...s, _id: String(s._id) })),
    });
  } catch (err) {
    console.error('GET /api/sales error:', err);
    return NextResponse.json(
      { error: 'Failed to fetch sales.' },
      { status: 500 }
    );
  }
}

// POST /api/sales — log a sale.
// CRITICAL ORDER: create the SaleRecord first, THEN decrement stock.
export async function POST(request: NextRequest) {
  const authed = await getSessionFromCookies();
  if (!authed) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectToDatabase();
    const body = await request.json();
    const {
      productId,
      sizeSold,
      channel,
      revenue,
      quantity = 1,
      note,
    } = body as {
      productId?: string;
      sizeSold?: string;
      channel?: 'Walk-in' | 'WhatsApp';
      revenue?: number;
      quantity?: number;
      note?: string;
    };

    if (!productId || !sizeSold || !channel || revenue == null) {
      return NextResponse.json(
        { error: 'productId, sizeSold, channel and revenue are required.' },
        { status: 400 }
      );
    }

    if (channel !== 'Walk-in' && channel !== 'WhatsApp') {
      return NextResponse.json(
        { error: 'Invalid sales channel.' },
        { status: 400 }
      );
    }

    const qty = Math.max(1, Math.floor(quantity));

    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found.' },
        { status: 404 }
      );
    }

    const variant = product.variants.find((v) => v.size === sizeSold);
    if (!variant) {
      return NextResponse.json(
        { error: 'Selected size not found on this product.' },
        { status: 404 }
      );
    }

    if (variant.stock < qty) {
      return NextResponse.json(
        { error: `Only ${variant.stock} unit(s) in stock for size ${sizeSold}.` },
        { status: 400 }
      );
    }

    // 1) Create the sale record first (preserves history).
    const sale = await SaleRecord.create({
      productId: product._id,
      productTitle: product.title,
      sizeSold,
      channel,
      revenue,
      quantity: qty,
      note: note?.trim() || undefined,
      date: new Date(),
    });

    // 2) Then decrement stock.
    variant.stock -= qty;
    await product.save();

    revalidateTag(PRODUCTS_TAG);

    return NextResponse.json(
      {
        sale: { ...sale.toObject(), _id: String(sale._id) },
        product: product.toJSON({ virtuals: true }),
      },
      { status: 201 }
    );
  } catch (err) {
    console.error('POST /api/sales error:', err);
    return NextResponse.json(
      { error: 'Failed to log sale.' },
      { status: 500 }
    );
  }
}
