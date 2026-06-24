// Client-side cart model used by the New Sale flow.

import type { Product } from '@/types';

export interface CartLine {
  productId: string;
  productName: string;
  size: string;
  mrp: number; // catalog price
  sellingPrice: number; // editable per-unit price
  quantity: number;
  maxStock: number; // available stock for this product+size
}

export function lineKey(productId: string, size: string): string {
  return `${productId}:${size}`;
}

export function makeCartLine(product: Product, size: string): CartLine {
  const variant = product.variants.find((v) => v.size === size);
  return {
    productId: product._id,
    productName: product.title,
    size,
    mrp: product.price,
    sellingPrice: product.price,
    quantity: 1,
    maxStock: variant?.stock ?? 0,
  };
}

export function cartSubtotal(lines: CartLine[]): number {
  return lines.reduce((s, l) => s + l.sellingPrice * l.quantity, 0);
}
