import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Invoice from '@/models/Invoice';
import { getSessionFromCookies } from '@/lib/auth';
import { getDaysAgo } from '@/lib/utils';
import type { SalesAnalyticsData } from '@/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// GET /api/sales-analytics — billing analytics from completed invoices.
export async function GET() {
  const authed = await getSessionFromCookies();
  if (!authed) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectToDatabase();

    const startToday = getDaysAgo(0);
    const startWeek = getDaysAgo(6); // inclusive of today => 7 days
    const startMonth = getDaysAgo(29);

    const completed = { status: 'completed' as const };

    const periodStage = (start: Date) => [
      { $match: { ...completed, createdAt: { $gte: start } } },
      {
        $group: {
          _id: null,
          revenue: { $sum: '$finalAmount' },
          count: { $sum: 1 },
        },
      },
    ];

    const [
      todayAgg,
      weekAgg,
      monthAgg,
      totalAgg,
      bestSellers,
      repeatCustomers,
    ] = await Promise.all([
      Invoice.aggregate(periodStage(startToday)),
      Invoice.aggregate(periodStage(startWeek)),
      Invoice.aggregate(periodStage(startMonth)),
      // Lifetime totals for AOV + invoice count
      Invoice.aggregate([
        { $match: completed },
        {
          $group: {
            _id: null,
            revenue: { $sum: '$finalAmount' },
            count: { $sum: 1 },
          },
        },
      ]),
      // Best sellers by units (across all completed invoices)
      Invoice.aggregate([
        { $match: completed },
        { $unwind: '$items' },
        {
          $group: {
            _id: '$items.productName',
            productId: { $first: '$items.productId' },
            unitsSold: { $sum: '$items.quantity' },
            revenue: { $sum: '$items.totalPrice' },
          },
        },
        { $sort: { unitsSold: -1 } },
        { $limit: 8 },
      ]),
      // Repeat customers (2+ completed invoices)
      Invoice.aggregate([
        { $match: completed },
        { $sort: { createdAt: -1 } },
        {
          $group: {
            _id: '$customerMobile',
            customerName: { $first: '$customerName' },
            orders: { $sum: 1 },
            totalSpent: { $sum: '$finalAmount' },
          },
        },
        { $match: { orders: { $gte: 2 } } },
        { $sort: { orders: -1, totalSpent: -1 } },
        { $limit: 8 },
      ]),
    ]);

    const totalRevenue = totalAgg[0]?.revenue ?? 0;
    const totalInvoices = totalAgg[0]?.count ?? 0;

    const data: SalesAnalyticsData = {
      today: {
        revenue: todayAgg[0]?.revenue ?? 0,
        count: todayAgg[0]?.count ?? 0,
      },
      week: {
        revenue: weekAgg[0]?.revenue ?? 0,
        count: weekAgg[0]?.count ?? 0,
      },
      month: {
        revenue: monthAgg[0]?.revenue ?? 0,
        count: monthAgg[0]?.count ?? 0,
      },
      averageOrderValue:
        totalInvoices > 0 ? Math.round(totalRevenue / totalInvoices) : 0,
      totalInvoices,
      bestSellers: bestSellers.map(
        (b: {
          _id: string;
          productId: unknown;
          unitsSold: number;
          revenue: number;
        }) => ({
          productId: b.productId ? String(b.productId) : null,
          productName: b._id,
          unitsSold: b.unitsSold,
          revenue: b.revenue,
        })
      ),
      repeatCustomers: repeatCustomers.map(
        (c: {
          _id: string;
          customerName: string | null;
          orders: number;
          totalSpent: number;
        }) => ({
          customerMobile: c._id,
          customerName: c.customerName ?? undefined,
          orders: c.orders,
          totalSpent: c.totalSpent,
        })
      ),
    };

    return NextResponse.json(data);
  } catch (err) {
    console.error('GET /api/sales-analytics error:', err);
    return NextResponse.json(
      { error: 'Failed to compute sales analytics.' },
      { status: 500 }
    );
  }
}
