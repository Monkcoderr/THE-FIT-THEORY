'use client';

import { useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { Category, Product } from '@/types';
import ProductGrid from './ProductGrid';

interface CategoryTab {
  label: string;
  // null = show every product. Otherwise match any of these schema categories.
  match: Category[] | null;
}

// Display labels mapped to the actual schema `Category` values.
// "Other Essentials" aggregates the catch-all categories.
const CATEGORY_TABS: CategoryTab[] = [
  { label: 'Shop All', match: null },
  { label: 'Trousers', match: ['Trousers'] },
  { label: 'T-Shirts', match: ['T-Shirt'] },
  { label: 'Jerseys', match: ['Jersey'] },
  { label: 'Polo T-Shirts', match: ['Polo'] },
  { label: 'Caps', match: ['Caps'] },
  { label: 'Shorts', match: ['Shorts'] },
  { label: 'Jackets', match: ['Jackets'] },
  { label: 'Compression', match: ['Compression'] },
  { label: 'Other Essentials', match: ['Vest', 'Others'] },
];

const CATEGORY_PLACEHOLDERS: Record<string, string> = {
  'Shop All': 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=160&h=160&q=80',
  'Trousers': 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=160&h=160&q=80',
  'T-Shirts': 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=160&h=160&q=80',
  'Jerseys': 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=160&h=160&q=80',
  'Polo T-Shirts': 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=160&h=160&q=80',
  'Caps': 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=160&h=160&q=80',
  'Shorts': 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&w=160&h=160&q=80',
  'Jackets': 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=160&h=160&q=80',
  'Compression': 'https://images.unsplash.com/photo-1605296867304-46d5465a25f1?auto=format&fit=crop&w=160&h=160&q=80',
  'Other Essentials': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=160&h=160&q=80',
};

interface CategoryShowcaseProps {
  products: Product[];
}

export default function CategoryShowcase({ products }: CategoryShowcaseProps) {
  const [active, setActive] = useState(0);
  const chipRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Client-side filtering — no extra API calls when switching categories.
  const filtered = useMemo(() => {
    const tab = CATEGORY_TABS[active];
    if (!tab.match) return products;
    const set = new Set(tab.match);
    return products.filter((p) => set.has(p.category));
  }, [active, products]);

  function selectTab(index: number) {
    setActive(index);
    // Keep the chosen chip visible within the horizontal scroll area (mobile).
    chipRefs.current[index]?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center',
    });
  }

  // Determine representative image for each category, falling back to curated placeholders.
  const getCategoryImageUrl = (tab: CategoryTab) => {
    if (tab.match) {
      const set = new Set(tab.match);
      const matchingProduct = products.find(
        (p) => set.has(p.category) && p.images && p.images.length > 0
      );
      if (matchingProduct) {
        return matchingProduct.images[0];
      }
    } else {
      const firstProduct = products.find((p) => p.images && p.images.length > 0);
      if (firstProduct) {
        return firstProduct.images[0];
      }
    }
    return CATEGORY_PLACEHOLDERS[tab.label] || CATEGORY_PLACEHOLDERS['Shop All'];
  };

  return (
    <section className="mx-auto max-w-nike px-4 py-10 sm:px-6 sm:py-12">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-extrabold uppercase tracking-tight text-nike-ink sm:text-2xl">
          Shop By Category
        </h2>
        <Link
          href="/shop"
          className="inline-flex items-center gap-1.5 text-sm font-bold text-nike-ink hover:opacity-60 transition-opacity"
        >
          View all <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
        </Link>
      </div>

      {/* Category circles — horizontally scrollable on mobile, wraps on desktop */}
      <div
        role="tablist"
        aria-label="Product categories"
        className="-mx-4 flex gap-6 sm:gap-8 overflow-x-auto scroll-smooth px-4 pb-4 sm:mx-0 sm:flex-wrap sm:px-0 justify-start [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {CATEGORY_TABS.map((tab, i) => {
          const isActive = i === active;
          const imageUrl = getCategoryImageUrl(tab);
          return (
            <button
              key={tab.label}
              ref={(el) => {
                chipRefs.current[i] = el;
              }}
              role="tab"
              aria-selected={isActive}
              onClick={() => selectTab(i)}
              className="flex shrink-0 flex-col items-center gap-3 focus:outline-none group pb-1"
            >
              {/* Circle container for image */}
              <div
                className={[
                  'w-16 h-16 rounded-full overflow-hidden flex items-center justify-center transition-all duration-300 ease-out border relative',
                  isActive
                    ? 'border-nike-ink border-2 shadow-md shadow-black/10 scale-105'
                    : 'border-nike-hairline hover:border-nike-ink/40 hover:scale-105',
                ].join(' ')}
              >
                <img
                  src={imageUrl}
                  alt={tab.label}
                  className={[
                    'w-full h-full object-cover transition-all duration-500 rounded-full',
                    isActive ? 'brightness-75 scale-110' : 'group-hover:scale-110',
                  ].join(' ')}
                  loading="lazy"
                />
                {isActive && (
                  <div className="absolute inset-0 bg-black/25 mix-blend-multiply rounded-full" />
                )}
              </div>
              
              {/* Text label container */}
              <div className="flex flex-col items-center min-h-[36px]">
                <span
                  className={[
                    'text-xs md:text-sm tracking-tight transition-all duration-300 whitespace-nowrap text-center px-1',
                    isActive ? 'font-bold text-nike-ink' : 'font-semibold text-nike-charcoal group-hover:text-nike-ink',
                  ].join(' ')}
                >
                  {tab.label}
                </span>
                
                {/* Active underline bar indicator */}
                <div
                  className={[
                    'h-[3px] bg-nike-ink rounded-full transition-all duration-300 mt-1.5',
                    isActive ? 'w-6 opacity-100' : 'w-0 opacity-0 group-hover:w-3 group-hover:opacity-40',
                  ].join(' ')}
                />
              </div>
            </button>
          );
        })}
      </div>

      {/* Product grid — re-keyed per tab to trigger the fade-in transition */}
      <div key={active} className="mt-6 animate-fade-in">
        <ProductGrid
          products={filtered}
          emptyMessage={`No products in ${CATEGORY_TABS[active].label} yet.`}
        />
      </div>
    </section>
  );
}


