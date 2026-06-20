import type { Product } from '@/types';
import { PackageSearch } from 'lucide-react';
import ProductCard from './ProductCard';

interface ProductGridProps {
  products: Product[];
  emptyMessage?: string;
}

export default function ProductGrid({
  products,
  emptyMessage = 'No products found.',
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <PackageSearch className="h-10 w-10 text-nike-stone" />
        <p className="mt-4 text-base font-medium text-nike-ink">
          {emptyMessage}
        </p>
        <p className="mt-1 text-sm text-nike-mute">
          Try adjusting your filters or check back soon.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product, i) => (
        <ProductCard key={product._id} product={product} priority={i < 4} />
      ))}
    </div>
  );
}
