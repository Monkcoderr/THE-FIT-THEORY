import Link from 'next/link';
import Image from 'next/image';
import type { Product } from '@/types';
import { formatPrice } from '@/lib/utils';
import StockBadge from './StockBadge';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

// Nike-style product card: full-bleed image on soft cloud, metadata below.
export default function ProductCard({ product, priority }: ProductCardProps) {
  return (
    <Link href={`/shop/${product.slug}`} className="group block">
      <div className="relative aspect-square w-full overflow-hidden bg-nike-cloud">
        {product.images[0] && (
          <Image
            src={product.images[0]}
            alt={product.title}
            fill
            priority={priority}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
        {product.featured && (
          <span className="absolute left-3 top-3 rounded-full border border-nike-hairline bg-white px-3 py-1 text-xs font-medium text-nike-ink">
            Featured
          </span>
        )}
        <div className="absolute bottom-3 left-3">
          <StockBadge status={product.stockStatus} />
        </div>
      </div>

      <div className="mt-3 space-y-0.5">
        <h3 className="text-sm font-medium text-nike-ink">{product.title}</h3>
        <p className="text-sm text-nike-mute">
          {product.category} · {product.fabric}
        </p>
        <p className="pt-1 text-sm font-medium text-nike-ink">
          {formatPrice(product.price)}
        </p>
      </div>
    </Link>
  );
}
