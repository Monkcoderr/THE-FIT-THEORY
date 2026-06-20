import { FilterQuery } from 'mongoose';
import { connectToDatabase } from '@/lib/mongodb';
import ProductModel, { IProduct } from '@/models/Product';
import { getStockStatus } from '@/lib/utils';
import type { Product, ProductFilters } from '@/types';

type LeanProduct = Record<string, unknown> & {
  _id: unknown;
  variants?: { size: string; stock: number }[];
  createdAt?: Date;
  updatedAt?: Date;
};

function serialize(p: LeanProduct): Product {
  const variants = (p.variants ?? []).map((v) => ({
    size: v.size,
    stock: v.stock,
  }));
  const totalStock = variants.reduce((s, v) => s + (v.stock ?? 0), 0);
  return {
    _id: String(p._id),
    title: p.title as string,
    slug: p.slug as string,
    price: p.price as number,
    images: (p.images as string[]) ?? [],
    category: p.category as Product['category'],
    fabric: p.fabric as Product['fabric'],
    fit: p.fit as Product['fit'],
    sport: p.sport as Product['sport'],
    variants: variants as Product['variants'],
    status: p.status as Product['status'],
    featured: Boolean(p.featured),
    totalStock,
    stockStatus: getStockStatus(totalStock),
    createdAt: p.createdAt ? new Date(p.createdAt).toISOString() : '',
    updatedAt: p.updatedAt ? new Date(p.updatedAt).toISOString() : '',
  };
}

// Storefront catalog query — active products only.
export async function getProducts(
  filters: ProductFilters = {}
): Promise<Product[]> {
  await connectToDatabase();

  const query: FilterQuery<IProduct> = { status: 'active' };
  if (filters.category) query.category = filters.category;
  if (filters.fabric) query.fabric = filters.fabric;
  if (filters.fit) query.fit = filters.fit;
  if (filters.sport) query.sport = filters.sport;
  if (filters.size) query['variants.size'] = filters.size;
  if (filters.search) {
    query.title = { $regex: filters.search.trim(), $options: 'i' };
  }

  let sortObj: Record<string, 1 | -1> = { createdAt: -1 };
  if (filters.sort === 'price-asc') sortObj = { price: 1 };
  else if (filters.sort === 'price-desc') sortObj = { price: -1 };

  const raw = await ProductModel.find(query).sort(sortObj).limit(200).lean();
  let products = raw.map((p) => serialize(p as LeanProduct));

  if (filters.inStock) {
    products = products.filter((p) => p.totalStock > 0);
  }

  return products;
}

export async function getFeaturedProducts(limit = 8): Promise<Product[]> {
  await connectToDatabase();
  const raw = await ProductModel.find({ status: 'active', featured: true })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
  let products = raw.map((p) => serialize(p as LeanProduct));

  // Fallback: if no featured products, show the newest active items.
  if (products.length === 0) {
    const fallback = await ProductModel.find({ status: 'active' })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
    products = fallback.map((p) => serialize(p as LeanProduct));
  }
  return products;
}

export async function getProductBySlug(
  slug: string
): Promise<Product | null> {
  await connectToDatabase();
  const p = await ProductModel.findOne({ slug, status: 'active' }).lean();
  if (!p) return null;
  return serialize(p as LeanProduct);
}

export async function getRelatedProducts(
  product: Product,
  limit = 4
): Promise<Product[]> {
  await connectToDatabase();
  const raw = await ProductModel.find({
    status: 'active',
    slug: { $ne: product.slug },
    $or: [{ category: product.category }, { sport: product.sport }],
  })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
  return raw.map((p) => serialize(p as LeanProduct));
}

export async function getAllActiveSlugs(): Promise<string[]> {
  await connectToDatabase();
  const docs = await ProductModel.find({ status: 'active' })
    .select('slug')
    .lean();
  return docs.map((d) => d.slug as string);
}
