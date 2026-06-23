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
  'Shop All': '/categories-placeholders/Shop All.jpeg',
  'Trousers': '/categories-placeholders/Trouser.webp',
  'T-Shirts': '/categories-placeholders/T-shirt.jpg',
  'Jerseys': '/categories-placeholders/jersey.webp',
  'Polo T-Shirts': '/categories-placeholders/polo-tshirt.jpg',
  'Caps': '/categories-placeholders/caps.jpg',
  'Shorts': '/categories-placeholders/shorts.jpg',
  'Jackets': '/categories-placeholders/jackets.jpg',
  'Compression': '/categories-placeholders/compression.jpg',
  'Other Essentials': '/categories-placeholders/others.jpg',
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

  // Determine representative image for each category.
  const getCategoryImageUrl = (tab: CategoryTab) => {
    return CATEGORY_PLACEHOLDERS[tab.label] || CATEGORY_PLACEHOLDERS['Shop All'];
  };

  return (
    <section className="mx-auto max-w-nike px-4 py-12 sm:px-6 sm:py-16">
      <div className="mb-7 flex items-end justify-between">
        <h2 className="text-2xl font-extrabold tracking-[-0.03em] text-nike-ink sm:text-3xl">
          Shop by Category
        </h2>
        <Link
          href="/shop"
          className="group inline-flex items-center gap-1 text-sm font-medium text-nike-mute transition-colors hover:text-nike-ink"
        >
          View all
          <ArrowRight
            className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
            strokeWidth={2}
          />
        </Link>
      </div>

      {/* Category pills — horizontally scrollable on mobile, wraps on desktop */}
      <div
        role="tablist"
        aria-label="Product categories"
        className="-mx-4 flex gap-5 overflow-x-auto scroll-smooth px-4 pb-3 sm:mx-0 sm:flex-wrap sm:gap-7 sm:px-0 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
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
              className="group flex shrink-0 flex-col items-center gap-2.5 pb-1 focus:outline-none"
            >
              {/* Circular image — gradient ring when active, white soft-shadow card otherwise */}
              <span
                className={[
                  'relative flex h-[72px] w-[72px] items-center justify-center rounded-full p-[3px] transition-all duration-300 ease-out',
                  isActive
                    ? 'scale-105 bg-gradient-to-r from-brand-from to-brand-to shadow-lg shadow-brand-from/25'
                    : 'bg-white shadow-[0_4px_14px_rgba(0,0,0,0.06)] group-hover:scale-105 group-hover:shadow-[0_8px_20px_rgba(0,0,0,0.10)]',
                ].join(' ')}
              >
                <span className="block h-full w-full overflow-hidden rounded-full bg-white p-[2px]">
                  <img
                    src={imageUrl}
                    alt={tab.label}
                    className="h-full w-full rounded-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                </span>
              </span>

              {/* Label + 4px gradient active indicator */}
              <span className="flex min-h-[34px] flex-col items-center">
                <span
                  className={[
                    'whitespace-nowrap px-1 text-center text-xs tracking-tight transition-colors duration-300 md:text-sm',
                    isActive
                      ? 'font-bold text-nike-ink'
                      : 'font-medium text-nike-mute group-hover:text-nike-ink',
                  ].join(' ')}
                >
                  {tab.label}
                </span>

                <span
                  className={[
                    'mt-1.5 block h-1 rounded-full bg-gradient-to-r from-brand-from to-brand-to transition-all duration-300',
                    isActive
                      ? 'w-6 opacity-100'
                      : 'w-0 opacity-0 group-hover:w-3 group-hover:opacity-40',
                  ].join(' ')}
                />
              </span>
            </button>
          );
        })}
      </div>

      {/* Product grid — re-keyed per tab to trigger the fade-in transition */}
      <div key={active} className="mt-8 animate-fade-in">
        <ProductGrid
          products={filtered}
          emptyMessage={`No products in ${CATEGORY_TABS[active].label} yet.`}
        />
      </div>
    </section>
  );
}


