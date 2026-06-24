import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Invoice from '@/models/Invoice';
import { getSessionFromCookies } from '@/lib/auth';
import { isValidMobile, normalizeMobile } from '@/lib/invoice';
import type { CustomerLookup } from '@/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// GET /api/customers?mobile=XXXXXXXXXX — look up a returning customer by mobile.
// Customer identity is derived from completed invoices (no separate table).
export async function GET(request: NextRequest) {
  const authed = await getSessionFromCookies();
  if (!authed) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const mobileRaw = searchParams.get('mobile') ?? '';
  const mobile = normalizeMobile(mobileRaw);

  if (!isValidMobile(mobile)) {
    return NextResponse.json(
      { error: 'A valid 10-digit mobile number is required.' },
      { status: 400 }
    );
  }

  try {
    await connectToDatabase();

    const agg = await Invoice.aggregate([
      { $match: { customerMobile: mobile, status: 'completed' } },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: '$customerMobile',
          previousPurchases: { $sum: 1 },
          totalSpent: { $sum: '$finalAmount' },
          lastPurchaseAt: { $first: '$createdAt' },
          // Most recent non-empty name wins.
          customerName: {
            $first: { $ifNull: ['$customerName', null] },
          },
        },
      },
    ]);

    if (agg.length === 0) {
      const empty: CustomerLookup = {
        found: false,
        customerMobile: mobile,
        previousPurchases: 0,
        totalSpent: 0,
      };
      return NextResponse.json({ customer: empty });
    }

    const row = agg[0] as {
      previousPurchases: number;
      totalSpent: number;
      lastPurchaseAt: Date;
      customerName: string | null;
    };

    const customer: CustomerLookup = {
      found: true,
      customerMobile: mobile,
      customerName: row.customerName ?? undefined,
      previousPurchases: row.previousPurchases,
      totalSpent: row.totalSpent,
      lastPurchaseAt: row.lastPurchaseAt
        ? new Date(row.lastPurchaseAt).toISOString()
        : undefined,
    };

    return NextResponse.json({ customer });
  } catch (err) {
    console.error('GET /api/customers error:', err);
    return NextResponse.json(
      { error: 'Failed to look up customer.' },
      { status: 500 }
    );
  }
}
