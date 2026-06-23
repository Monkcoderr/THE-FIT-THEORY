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
  {
    label: 'Football',
    href: '/shop?sport=Football',
    image: '/football.png'
  },
  {
    label: 'Gym / Lifting',
    href: '/shop?sport=Gym%2FLifting',
    image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=400&h=500&q=80'
  },
  {
    label: 'Running',
    href: '/shop?sport=Running',
    image: '/running.png'
  },
  {
    label: 'Jerseys',
    href: '/shop?category=Jersey',
    image: '/jerseys.png'
  },
];

export default async function HomePage() {
  const [featured, allProducts] = await Promise.all([
    getFeaturedProducts(8),
    getProducts(),
  ]);

  return (
    <>
      <Navbar />
      <main className="pt-14">
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
                className="group relative flex aspect-[3/4] sm:aspect-[4/5] items-end overflow-hidden rounded-2xl bg-nike-cloud p-5 shadow-sm"
              >
                {/* Background Image */}
                <img
                  src={cat.image}
                  alt={cat.label}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                {/* Dark gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent transition-opacity duration-300 group-hover:opacity-90" />
                
                {/* Card Content */}
                <div className="relative z-10 w-full">
                  <span className="block text-xl font-extrabold uppercase tracking-tight text-white sm:text-2xl">
                    {cat.label}
                  </span>
                  <span className="mt-3.5 inline-flex items-center gap-1 rounded-full bg-white px-4 py-1.5 text-xs font-bold text-nike-ink transition-transform duration-300 group-hover:scale-105 active:scale-95">
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
