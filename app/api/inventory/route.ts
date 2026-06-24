import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { connectToDatabase } from '@/lib/mongodb';
import Product from '@/models/Product';
import { getSessionFromCookies } from '@/lib/auth';
import { PRODUCTS_TAG } from '@/lib/data';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// PATCH /api/inventory — increment / decrement a single variant's stock.
// Used for restocking (+) and manual corrections. Sales go through /api/sales.
export async function PATCH(request: NextRequest) {
  const authed = await getSessionFromCookies();
  if (!authed) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectToDatabase();
    const body = await request.json();
    const { productId, size, delta } = body as {
      productId?: string;
      size?: string;
      delta?: number;
    };

    if (!productId || !size || typeof delta !== 'number') {
      return NextResponse.json(
        { error: 'productId, size and numeric delta are required.' },
        { status: 400 }
      );
    }

    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found.' },
        { status: 404 }
      );
    }

    const variant = product.variants.find((v) => v.size === size);
    if (!variant) {
      return NextResponse.json(
        { error: 'Variant size not found on this product.' },
        { status: 404 }
      );
    }

    const next = variant.stock + delta;
    if (next < 0) {
      return NextResponse.json(
        { error: 'Stock cannot go below zero.' },
        { status: 400 }
      );
    }

    variant.stock = next;
    await product.save();

    revalidateTag(PRODUCTS_TAG);

    return NextResponse.json({
      product: product.toJSON({ virtuals: true }),
    });
  } catch (err) {
    console.error('PATCH /api/inventory error:', err);
    return NextResponse.json(
      { error: 'Failed to update inventory.' },
      { status: 500 }
    );
  }
}
