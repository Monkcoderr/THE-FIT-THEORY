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
              <span
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
                  <span className="absolute inset-0 bg-black/25 mix-blend-multiply rounded-full" />
                )}
              </span>
              
              {/* Text label container */}
              <span className="flex flex-col items-center min-h-[36px]">
                <span
                  className={[
                    'text-xs md:text-sm tracking-tight transition-all duration-300 whitespace-nowrap text-center px-1',
                    isActive ? 'font-bold text-nike-ink' : 'font-semibold text-nike-charcoal group-hover:text-nike-ink',
                  ].join(' ')}
                >
                  {tab.label}
                </span>
                
                {/* Active underline bar indicator */}
                <span
                  className={[
                    'h-[3px] bg-nike-ink rounded-full transition-all duration-300 mt-1.5 block',
                    isActive ? 'w-6 opacity-100' : 'w-0 opacity-0 group-hover:w-3 group-hover:opacity-40',
                  ].join(' ')}
                />
              </span>
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


