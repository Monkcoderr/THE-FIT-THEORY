import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getFeaturedProducts, getProducts } from '@/lib/data';
import Navbar from '@/components/storefront/Navbar';
import Footer from '@/components/storefront/Footer';
import HeroSection from '@/components/storefront/HeroSection';
import ProductGrid from '@/components/storefront/ProductGrid';
import CategoryShowcase from '@/components/storefront/CategoryShowcase';

export const dynamic = 'force-dynamic';

const CATEGORIES = [
  { label: 'Football', href: '/shop?sport=Football' },
  { label: 'Gym / Lifting', href: '/shop?sport=Gym%2FLifting' },
  { label: 'Running', href: '/shop?sport=Running' },
  { label: 'Jerseys', href: '/shop?category=Jersey' },
];

export default async function HomePage() {
  const [featured, allProducts] = await Promise.all([
    getFeaturedProducts(8),
    getProducts(),
  ]);

  return (
    <>
      <Navbar />
      <main>
        <HeroSection />

        {/* Browse all categories without leaving the homepage */}
        <CategoryShowcase products={allProducts} />

        {/* Featured */}
        <section className="mx-auto max-w-nike px-4 py-16 sm:px-6">
          <div className="mb-8 flex items-end justify-between">
            <h2 className="text-2xl font-extrabold uppercase tracking-tight text-nike-ink sm:text-3xl">
              Featured
            </h2>
            <Link
              href="/shop"
              className="inline-flex items-center gap-1 text-sm font-medium text-nike-ink hover:opacity-60"
            >
              Shop all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <ProductGrid
            products={featured}
            emptyMessage="No featured products yet."
          />
        </section>

        {/* Shop by sport */}
        <section className="mx-auto max-w-nike px-4 pb-20 sm:px-6">
          <h2 className="mb-6 text-2xl font-extrabold uppercase tracking-tight text-nike-ink sm:text-3xl">
            Shop by Sport
          </h2>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.label}
                href={cat.href}
                className="group relative flex aspect-[4/5] items-end overflow-hidden bg-nike-cloud p-5"
              >
                <div
                  className="absolute inset-0 transition-transform duration-500 group-hover:scale-105"
                  style={{
                    background:
                      'linear-gradient(160deg, #1a1a1c 0%, #2b2b2e 60%, #39393b 100%)',
                  }}
                />
                <div className="relative z-10">
                  <span className="block text-lg font-bold uppercase tracking-tight text-white">
                    {cat.label}
                  </span>
                  <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-white px-4 py-1.5 text-xs font-medium text-nike-ink">
                    Shop now
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
