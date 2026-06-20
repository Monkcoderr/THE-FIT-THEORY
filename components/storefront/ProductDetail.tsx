'use client';

import { useState } from 'react';
import { Truck, Store, ShieldCheck } from 'lucide-react';
import type { Product } from '@/types';
import { formatPrice } from '@/lib/utils';
import ImageGallery from './ImageGallery';
import SizeSelector from './SizeSelector';
import WhatsAppButton from './WhatsAppButton';
import SizeGuideModal from './SizeGuideModal';
import StockBadge from './StockBadge';

interface ProductDetailProps {
  product: Product;
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  return (
    <>
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        {/* Gallery */}
        <ImageGallery images={product.images} alt={product.title} />

        {/* Details */}
        <div className="lg:py-2">
          <div className="mb-2 flex items-center gap-3">
            <StockBadge status={product.stockStatus} />
            {product.featured && (
              <span className="rounded-full border border-nike-hairline px-3 py-1 text-xs font-medium text-nike-ink">
                Featured
              </span>
            )}
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-nike-ink sm:text-3xl">
            {product.title}
          </h1>
          <p className="mt-1 text-base text-nike-mute">
            {product.category} · {product.sport}
          </p>

          <p className="mt-4 text-2xl font-semibold text-nike-ink">
            {formatPrice(product.price)}
          </p>

          {/* Attributes */}
          <div className="mt-6 grid grid-cols-2 gap-3">
            {[
              { label: 'Fabric', value: product.fabric },
              { label: 'Fit', value: product.fit },
              { label: 'Sport', value: product.sport },
              { label: 'Category', value: product.category },
            ].map((a) => (
              <div
                key={a.label}
                className="rounded-lg bg-nike-cloud px-4 py-3"
              >
                <p className="text-xs text-nike-mute">{a.label}</p>
                <p className="text-sm font-medium text-nike-ink">{a.value}</p>
              </div>
            ))}
          </div>

          {/* Size */}
          <div className="mt-8">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-medium text-nike-ink">
                Select size
              </span>
              <SizeGuideModal />
            </div>
            <SizeSelector
              variants={product.variants}
              selected={selectedSize}
              onSelect={setSelectedSize}
            />
          </div>

          {/* Desktop CTA */}
          <div className="mt-8 hidden lg:block">
            <WhatsAppButton product={product} selectedSize={selectedSize} />
            <p className="mt-3 text-center text-xs text-nike-mute">
              You&apos;ll be redirected to WhatsApp to confirm your order.
            </p>
          </div>

          {/* Trust signals */}
          <div className="mt-8 space-y-3 border-t border-nike-hairline-soft pt-6">
            <div className="flex items-center gap-3 text-sm text-nike-charcoal">
              <Store className="h-4 w-4 text-nike-mute" />
              In-store pickup available
            </div>
            <div className="flex items-center gap-3 text-sm text-nike-charcoal">
              <Truck className="h-4 w-4 text-nike-mute" />
              Local delivery on confirmed orders
            </div>
            <div className="flex items-center gap-3 text-sm text-nike-charcoal">
              <ShieldCheck className="h-4 w-4 text-nike-mute" />
              Genuine quality, guaranteed
            </div>
          </div>
        </div>
      </div>

      {/* Sticky mobile WhatsApp bar */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-nike-hairline-soft bg-white/95 p-4 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-nike items-center gap-3">
          <div className="shrink-0">
            <p className="text-xs text-nike-mute">Price</p>
            <p className="text-base font-semibold text-nike-ink">
              {formatPrice(product.price)}
            </p>
          </div>
          <div className="flex-1">
            <WhatsAppButton product={product} selectedSize={selectedSize} />
          </div>
        </div>
      </div>
    </>
  );
}
