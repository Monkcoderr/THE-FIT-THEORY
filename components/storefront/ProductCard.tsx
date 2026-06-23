import Link from 'next/link';
import Image from 'next/image';
import type { Product } from '@/types';
import { formatPrice } from '@/lib/utils';
import StockBadge from './StockBadge';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

// Premium athletic product card: white rounded surface, soft shadow, hover lift,
// larger consistent image area, gradient featured capsule, refined price hierarchy.
export default function ProductCard({ product, priority }: ProductCardProps) {
  return (
    <Link href={`/shop/${product.slug}`} className="group block">
      <div className="overflow-hidden rounded-3xl bg-white shadow-[0_8px_30px_rgba(0,0,0,0.04)] ring-1 ring-black/[0.03] transition-all duration-300 ease-out group-hover:-translate-y-1.5 group-hover:shadow-[0_18px_44px_rgba(0,0,0,0.10)]">
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-nike-cloud">
          {product.images[0] && (
            <Image
              src={product.images[0]}
              alt={product.title}
              fill
              priority={priority}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            />
          )}

          {product.featured && (
            <span className="absolute left-3 top-3 rounded-full bg-gradient-to-r from-brand-from to-brand-to px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm shadow-brand-from/30">
              Featured
            </span>
          )}

          <div className="absolute bottom-3 left-3">
            <StockBadge status={product.stockStatus} />
          </div>
        </div>

        <div className="space-y-1 p-4">
          <h3 className="truncate text-[15px] font-semibold tracking-tight text-nike-ink">
            {product.title}
          </h3>
          <p className="truncate text-[11px] font-medium uppercase tracking-wide text-nike-mute">
            {product.category} • {product.fabric}
          </p>
          <p className="pt-0.5 text-xl font-extrabold tracking-tight text-nike-ink">
            {formatPrice(product.price)}
          </p>
        </div>
      </div>
    </Link>
  );
}
