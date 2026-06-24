import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ChevronLeft } from 'lucide-react';
import { getProductBySlug, getRelatedProducts } from '@/lib/data';
import Navbar from '@/components/storefront/Navbar';
import Footer from '@/components/storefront/Footer';
import ProductDetail from '@/components/storefront/ProductDetail';
import ProductGrid from '@/components/storefront/ProductGrid';

// ISR: product pages are cached and refreshed in the background; admin edits
// trigger revalidateTag('products') for instant updates.
export const revalidate = 3600;

interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);
  if (!product) {
    return { title: 'Product not found' };
  }
  return {
    title: product.title,
    description: `${product.title} — ${product.category} in ${product.fabric}. ${product.fit} fit for ${product.sport}.`,
    openGraph: {
      title: product.title,
      images: product.images.slice(0, 1),
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const product = await getProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  const related = await getRelatedProducts(product, 4);

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-nike px-4 pb-28 pt-20 sm:px-6 lg:pb-20">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-1 text-sm text-nike-mute transition-colors hover:text-nike-ink"
        >
          <ChevronLeft className="h-4 w-4" /> Back to home
        </Link>

        <ProductDetail product={product} />

        {related.length > 0 && (
          <section className="mt-20">
            <h2 className="mb-6 text-xl font-extrabold uppercase tracking-tight text-nike-ink sm:text-2xl">
              You might also like
            </h2>
            <ProductGrid products={related} />
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
