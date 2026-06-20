// ─── Shared TypeScript interfaces for the entire application ───

export type Size = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'Free Size';

export type Category =
  | 'Jersey'
  | 'Trousers'
  | 'T-Shirt'
  | 'Polo'
  | 'Shorts'
  | 'Compression'
  | 'Caps'
  | 'Vest'
  | 'Jackets'
  | 'Others';

export type Fabric =
  | 'Dry-Fit'
  | 'Cotton'
  | 'Mesh'
  | 'Polyester'
  | 'Cotton-Polyester Blend'
  | 'Nylon';

export type Fit = 'Compression' | 'Slim' | 'Regular' | 'Oversized' | 'Relaxed';

export type Sport =
  | 'Football'
  | 'Running'
  | 'Gym/Lifting'
  | 'Cricket'
  | 'Basketball'
  | 'General';

export type ProductStatus = 'active' | 'draft';

export type StockStatus = 'in-stock' | 'low-stock' | 'out-of-stock';

export type SaleChannel = 'Walk-in' | 'WhatsApp';

export interface Variant {
  size: Size;
  stock: number;
}

export interface Product {
  _id: string;
  title: string;
  slug: string;
  price: number;
  images: string[];
  category: Category;
  fabric: Fabric;
  fit: Fit;
  sport: Sport;
  variants: Variant[];
  status: ProductStatus;
  featured: boolean;
  totalStock: number;
  stockStatus: StockStatus;
  createdAt: string;
  updatedAt: string;
}

export interface SaleRecord {
  _id: string;
  productId: string;
  productTitle: string;
  sizeSold: string;
  channel: SaleChannel;
  revenue: number;
  quantity: number;
  note?: string;
  date: string;
}

// ─── API payloads ───

export interface ProductFormData {
  title: string;
  price: number;
  images: string[];
  category: Category;
  fabric: Fabric;
  fit: Fit;
  sport: Sport;
  variants: Variant[];
  status: ProductStatus;
  featured: boolean;
}

export interface InventoryUpdatePayload {
  productId: string;
  size: Size;
  delta: number;
}

export interface SalePayload {
  productId: string;
  productTitle: string;
  sizeSold: string;
  channel: SaleChannel;
  revenue: number;
  quantity: number;
  note?: string;
}

export interface UploadResponse {
  url: string;
  publicId: string;
}

// ─── Catalog filtering ───

export interface ProductFilters {
  category?: Category;
  fabric?: Fabric;
  fit?: Fit;
  sport?: Sport;
  size?: Size;
  search?: string;
  sort?: 'newest' | 'price-asc' | 'price-desc';
  inStock?: boolean;
}

// ─── Analytics ───

export interface AnalyticsSummary {
  totalRevenue: number;
  totalSales: number;
  totalProducts: number;
  activeProducts: number;
  lowStockCount: number;
  outOfStockCount: number;
  revenueToday: number;
  revenue7Days: number;
  revenue30Days: number;
}

export interface DailyRevenuePoint {
  date: string;
  revenue: number;
  sales: number;
}

export interface ChannelBreakdown {
  channel: SaleChannel;
  count: number;
  revenue: number;
}

export interface VelocityItem {
  productId: string;
  productTitle: string;
  unitsSold: number;
  revenue: number;
}

export interface DeadStockItem {
  _id: string;
  title: string;
  slug: string;
  totalStock: number;
  daysSinceCreated: number;
  price: number;
}

export interface AnalyticsData {
  summary: AnalyticsSummary;
  dailyRevenue: DailyRevenuePoint[];
  channelBreakdown: ChannelBreakdown[];
  fastMovers: VelocityItem[];
  deadStock: DeadStockItem[];
  recentSales: SaleRecord[];
}
