import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Product from '@/models/Product';
import SaleRecord from '@/models/SaleRecord';
import Invoice from '@/models/Invoice';
import { getSessionFromCookies } from '@/lib/auth';
import { getDaysAgo } from '@/lib/utils';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// GET /api/analytics — aggregated dashboard data (admin only).
// All heavy lifting uses MongoDB aggregation pipelines (not JS array methods).
export async function GET() {
  const authed = await getSessionFromCookies();
  if (!authed) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectToDatabase();

    const startToday = getDaysAgo(0);
    const start7 = getDaysAgo(6); // inclusive of today => 7 days
    const start30 = getDaysAgo(29);
    // Start of the current calendar month (for "this month" profit/discounts).
    const now0 = new Date();
    const startMonth = new Date(now0.getFullYear(), now0.getMonth(), 1);

    const [
      revenueAgg,
      todayAgg,
      sevenAgg,
      thirtyAgg,
      dailyRevenue,
      channelBreakdown,
      fastMovers,
      productStats,
      deadStock,
      recentSales,
      profitTodayAgg,
      profitMonthAgg,
      discountsTodayAgg,
      discountsMonthAgg,
    ] = await Promise.all([
      // Lifetime revenue + total sales count
      SaleRecord.aggregate([
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: '$revenue' },
            totalSales: { $sum: '$quantity' },
          },
        },
      ]),
      // Today
      SaleRecord.aggregate([
        { $match: { date: { $gte: startToday } } },
        { $group: { _id: null, revenue: { $sum: '$revenue' } } },
      ]),
      // Last 7 days
      SaleRecord.aggregate([
        { $match: { date: { $gte: start7 } } },
        { $group: { _id: null, revenue: { $sum: '$revenue' } } },
      ]),
      // Last 30 days
      SaleRecord.aggregate([
        { $match: { date: { $gte: start30 } } },
        { $group: { _id: null, revenue: { $sum: '$revenue' } } },
      ]),
      // Daily revenue series for the last 30 days
      SaleRecord.aggregate([
        { $match: { date: { $gte: start30 } } },
        {
          $group: {
            _id: {
              $dateToString: { format: '%Y-%m-%d', date: '$date' },
            },
            revenue: { $sum: '$revenue' },
            sales: { $sum: '$quantity' },
          },
        },
        { $sort: { _id: 1 } },
      ]),
      // Channel breakdown (Walk-in vs WhatsApp)
      SaleRecord.aggregate([
        {
          $group: {
            _id: '$channel',
            count: { $sum: '$quantity' },
            revenue: { $sum: '$revenue' },
          },
        },
      ]),
      // Fast movers — top products by units sold (last 30 days)
      SaleRecord.aggregate([
        { $match: { date: { $gte: start30 } } },
        {
          $group: {
            _id: '$productId',
            productTitle: { $first: '$productTitle' },
            unitsSold: { $sum: '$quantity' },
            revenue: { $sum: '$revenue' },
          },
        },
        { $sort: { unitsSold: -1 } },
        { $limit: 5 },
      ]),
      // Product counts + stock status via aggregation over variants
      Product.aggregate([
        {
          $addFields: {
            totalStock: { $sum: '$variants.stock' },
          },
        },
        {
          $group: {
            _id: null,
            totalProducts: { $sum: 1 },
            activeProducts: {
              $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] },
            },
            lowStockCount: {
              $sum: {
                $cond: [
                  {
                    $and: [
                      { $gt: ['$totalStock', 0] },
                      { $lt: ['$totalStock', 3] },
                    ],
                  },
                  1,
                  0,
                ],
              },
            },
            outOfStockCount: {
              $sum: { $cond: [{ $eq: ['$totalStock', 0] }, 1, 0] },
            },
          },
        },
      ]),
      // Dead stock — active products with stock that have never sold OR
      // not sold in the last 30 days, oldest first.
      Product.aggregate([
        { $addFields: { totalStock: { $sum: '$variants.stock' } } },
        { $match: { status: 'active', totalStock: { $gt: 0 } } },
        {
          $lookup: {
            from: 'salerecords',
            let: { pid: '$_id' },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ['$productId', '$$pid'] },
                  date: { $gte: start30 },
                },
              },
              { $limit: 1 },
            ],
            as: 'recentSales',
          },
        },
        { $match: { recentSales: { $size: 0 } } },
        { $sort: { createdAt: 1 } },
        { $limit: 8 },
        {
          $project: {
            title: 1,
            slug: 1,
            price: 1,
            totalStock: 1,
            createdAt: 1,
          },
        },
      ]),
      // Recent sales feed
      SaleRecord.find().sort({ date: -1 }).limit(8).lean(),
      // Profit today — revenue minus snapshotted cost (SaleRecord covers both
      // quick sales and invoice-synced sales).
      SaleRecord.aggregate([
        { $match: { date: { $gte: startToday } } },
        {
          $group: {
            _id: null,
            revenue: { $sum: '$revenue' },
            cost: {
              $sum: {
                $multiply: [{ $ifNull: ['$costPrice', 0] }, '$quantity'],
              },
            },
          },
        },
      ]),
      // Profit this calendar month
      SaleRecord.aggregate([
        { $match: { date: { $gte: startMonth } } },
        {
          $group: {
            _id: null,
            revenue: { $sum: '$revenue' },
            cost: {
              $sum: {
                $multiply: [{ $ifNull: ['$costPrice', 0] }, '$quantity'],
              },
            },
          },
        },
      ]),
      // Discounts given today (only invoiced sales carry discounts)
      Invoice.aggregate([
        { $match: { status: 'completed', createdAt: { $gte: startToday } } },
        { $group: { _id: null, discounts: { $sum: '$discountAmount' } } },
      ]),
      // Discounts given this calendar month
      Invoice.aggregate([
        { $match: { status: 'completed', createdAt: { $gte: startMonth } } },
        { $group: { _id: null, discounts: { $sum: '$discountAmount' } } },
      ]),
    ]);

    const now = Date.now();
    const summary = {
      totalRevenue: revenueAgg[0]?.totalRevenue ?? 0,
      totalSales: revenueAgg[0]?.totalSales ?? 0,
      totalProducts: productStats[0]?.totalProducts ?? 0,
      activeProducts: productStats[0]?.activeProducts ?? 0,
      lowStockCount: productStats[0]?.lowStockCount ?? 0,
      outOfStockCount: productStats[0]?.outOfStockCount ?? 0,
      revenueToday: todayAgg[0]?.revenue ?? 0,
      revenue7Days: sevenAgg[0]?.revenue ?? 0,
      revenue30Days: thirtyAgg[0]?.revenue ?? 0,
      profitToday:
        (profitTodayAgg[0]?.revenue ?? 0) - (profitTodayAgg[0]?.cost ?? 0),
      profitMonth:
        (profitMonthAgg[0]?.revenue ?? 0) - (profitMonthAgg[0]?.cost ?? 0),
      discountsToday: discountsTodayAgg[0]?.discounts ?? 0,
      discountsMonth: discountsMonthAgg[0]?.discounts ?? 0,
    };

    return NextResponse.json({
      summary,
      dailyRevenue: dailyRevenue.map(
        (d: { _id: string; revenue: number; sales: number }) => ({
          date: d._id,
          revenue: d.revenue,
          sales: d.sales,
        })
      ),
      channelBreakdown: (['Walk-in', 'WhatsApp'] as const).map((ch) => {
        const found = channelBreakdown.find(
          (c: { _id: string }) => c._id === ch
        );
        return {
          channel: ch,
          count: found?.count ?? 0,
          revenue: found?.revenue ?? 0,
        };
      }),
      fastMovers: fastMovers.map(
        (f: {
          _id: unknown;
          productTitle: string;
          unitsSold: number;
          revenue: number;
        }) => ({
          productId: String(f._id),
          productTitle: f.productTitle,
          unitsSold: f.unitsSold,
          revenue: f.revenue,
        })
      ),
      deadStock: deadStock.map(
        (p: {
          _id: unknown;
          title: string;
          slug: string;
          price: number;
          totalStock: number;
          createdAt: string | Date;
        }) => ({
          _id: String(p._id),
          title: p.title,
          slug: p.slug,
          price: p.price,
          totalStock: p.totalStock,
          daysSinceCreated: Math.floor(
            (now - new Date(p.createdAt).getTime()) / (1000 * 60 * 60 * 24)
          ),
        })
      ),
      recentSales: recentSales.map((s) => ({
        ...s,
        _id: String(s._id),
        productId: String(s.productId),
      })),
    });
  } catch (err) {
    console.error('GET /api/analytics error:', err);
    return NextResponse.json(
      { error: 'Failed to compute analytics.' },
      { status: 500 }
    );
  }
}
