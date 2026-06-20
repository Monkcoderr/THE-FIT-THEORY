import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectToDatabase } from '@/lib/mongodb';
import Product from '@/models/Product';
import { getSessionFromCookies } from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function isValidId(id: string) {
  return mongoose.Types.ObjectId.isValid(id);
}

// GET /api/products/[id] — fetch a single product
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  if (!isValidId(id)) {
    return NextResponse.json({ error: 'Invalid product id.' }, { status: 400 });
  }

  try {
    await connectToDatabase();
    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found.' },
        { status: 404 }
      );
    }
    return NextResponse.json({
      product: product.toJSON({ virtuals: true }),
    });
  } catch (err) {
    console.error('GET /api/products/[id] error:', err);
    return NextResponse.json(
      { error: 'Failed to fetch product.' },
      { status: 500 }
    );
  }
}

// PUT /api/products/[id] — update a product (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authed = await getSessionFromCookies();
  if (!authed) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = params;
  if (!isValidId(id)) {
    return NextResponse.json({ error: 'Invalid product id.' }, { status: 400 });
  }

  try {
    await connectToDatabase();
    const body = await request.json();

    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found.' },
        { status: 404 }
      );
    }

    const editable = [
      'title',
      'price',
      'images',
      'category',
      'fabric',
      'fit',
      'sport',
      'variants',
      'status',
      'featured',
    ] as const;

    for (const key of editable) {
      if (body[key] !== undefined) {
        // @ts-expect-error dynamic assignment of validated fields
        product[key] = body[key];
      }
    }

    // Re-run validation + slug hook (title change regenerates slug)
    await product.save();

    return NextResponse.json({
      product: product.toJSON({ virtuals: true }),
    });
  } catch (err) {
    console.error('PUT /api/products/[id] error:', err);
    return NextResponse.json(
      { error: 'Failed to update product.' },
      { status: 500 }
    );
  }
}

// DELETE /api/products/[id] — remove a product (admin only)
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
    return NextResponse.json({ error: 'Invalid product id.' }, { status: 400 });
  }

  try {
    await connectToDatabase();
    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json(
        { error: 'Product not found.' },
        { status: 404 }
      );
    }
    // Sale history is intentionally preserved (denormalized productTitle).
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('DELETE /api/products/[id] error:', err);
    return NextResponse.json(
      { error: 'Failed to delete product.' },
      { status: 500 }
    );
  }
}
