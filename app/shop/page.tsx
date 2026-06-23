import { Suspense } from 'react';
import { getProducts } from '@/lib/data';
import type { ProductFilters } from '@/types';
import Navbar from '@/components/storefront/Navbar';
import Footer from '@/components/storefront/Footer';
import ProductGrid from '@/components/storefront/ProductGrid';
import FilterSidebar from '@/components/storefront/FilterSidebar';
import FilterSheet from '@/components/storefront/FilterSheet';
import ActiveFilters from '@/components/storefront/ActiveFilters';

export const dynamic = 'force-dynamic';

interface ShopPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

function param(
  v: string | string[] | undefined
): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const filters: ProductFilters = {
    category: param(searchParams.category) as ProductFilters['category'],
    fabric: param(searchParams.fabric) as ProductFilters['fabric'],
    fit: param(searchParams.fit) as ProductFilters['fit'],
    sport: param(searchParams.sport) as ProductFilters['sport'],
    size: param(searchParams.size) as ProductFilters['size'],
    search: param(searchParams.search),
    sort: param(searchParams.sort) as ProductFilters['sort'],
    inStock: param(searchParams.inStock) === 'true',
  };

  const products = await getProducts(filters);

  return (
    <>
      <Navbar />
      <main className="premium-surface min-h-screen pt-24">
        <div className="mx-auto max-w-nike px-4 pb-20 sm:px-6">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h1 className="text-2xl font-extrabold tracking-[-0.03em] text-nike-ink sm:text-3xl">
              {filters.sport || filters.category || 'All Products'}
            </h1>
            <p className="mt-1 text-sm text-nike-mute">
              {products.length} item{products.length === 1 ? '' : 's'}
            </p>
          </div>
          {/* Mobile filter trigger */}
          <div className="lg:hidden">
            <Suspense fallback={null}>
              <FilterSheet />
            </Suspense>
          </div>
        </div>

        <Suspense fallback={null}>
          <div className="mb-6">
            <ActiveFilters />
          </div>
        </Suspense>

        <div className="flex gap-10">
          {/* Desktop sidebar */}
          <div className="hidden w-56 shrink-0 lg:block">
            <Suspense fallback={null}>
              <FilterSidebar />
            </Suspense>
          </div>

          {/* Grid */}
          <div className="min-w-0 flex-1">
            <ProductGrid
              products={products}
              emptyMessage="No products match these filters."
            />
          </div>
        </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
