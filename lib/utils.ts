import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type {
  Category,
  Fabric,
  Fit,
  Sport,
  Size,
  StockStatus,
} from '@/types';

// Tailwind class merger utility
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

// Price formatter for Indian Rupees
export function formatPrice(amount: number): string {
  return `₹ ${amount.toLocaleString('en-IN')}`;
}

// Compact number formatter (for stats)
export function formatCompact(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(amount);
}

// Slugify any string to URL-safe format
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

// Get date N days ago (at start of day)
export function getDaysAgo(days: number): Date {
  const date = new Date();
  date.setDate(date.getDate() - days);
  date.setHours(0, 0, 0, 0);
  return date;
}

// Relative time string ("2h ago", "3d ago")
export function timeAgo(input: string | Date): string {
  const date = typeof input === 'string' ? new Date(input) : input;
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `${weeks}w ago`;
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
  });
}

// Stock status helper
export function getStockStatus(totalStock: number): StockStatus {
  if (totalStock === 0) return 'out-of-stock';
  if (totalStock < 3) return 'low-stock';
  return 'in-stock';
}

// Stock status display config (for badges/indicators)
export const STOCK_CONFIG: Record<
  StockStatus,
  {
    label: string;
    nikeLabel: string;
    dotColor: string;
    storefrontBg: string;
    storefrontText: string;
    adminColor: string;
  }
> = {
  'in-stock': {
    label: 'In Stock',
    nikeLabel: 'In Stock',
    dotColor: '#117A00',
    storefrontBg: '#E7F5E7',
    storefrontText: '#117A00',
    adminColor: '#50E3C2',
  },
  'low-stock': {
    label: 'Low Stock',
    nikeLabel: 'Low Stock',
    dotColor: '#CC6600',
    storefrontBg: '#FFF3CD',
    storefrontText: '#CC6600',
    adminColor: '#F5A623',
  },
  'out-of-stock': {
    label: 'Out of Stock',
    nikeLabel: 'Sold Out',
    dotColor: '#CC0000',
    storefrontBg: '#F5F5F5',
    storefrontText: '#757575',
    adminColor: '#FF4444',
  },
};

// Truncate text to N characters
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

// ─── Enum option lists (single source for forms & filters) ───

export const SIZES: Size[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size'];

export const CATEGORIES: Category[] = [
  'Jersey',
  'Trousers',
  'T-Shirt',
  'Polo',
  'Shorts',
  'Compression',
  'Caps',
  'Vest',
  'Jackets',
  'Others',
];

export const FABRICS: Fabric[] = [
  'Dry-Fit',
  'Cotton',
  'Mesh',
  'Polyester',
  'Cotton-Polyester Blend',
  'Nylon',
];

export const FITS: Fit[] = [
  'Compression',
  'Slim',
  'Regular',
  'Oversized',
  'Relaxed',
];

export const SPORTS: Sport[] = [
  'Football',
  'Running',
  'Gym/Lifting',
  'Cricket',
  'Basketball',
  'General',
];
