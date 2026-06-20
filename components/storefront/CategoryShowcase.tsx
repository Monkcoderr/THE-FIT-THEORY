'use client';

import { useMemo, useRef, useState } from 'react';
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
  { label: 'Other Essentials', match: ['Compression', 'Vest', 'Others'] },
];

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

  return (
    <section className="mx-auto max-w-nike px-4 py-10 sm:px-6 sm:py-12">
      <h2 className="mb-5 text-2xl font-extrabold uppercase tracking-tight text-nike-ink sm:text-3xl">
        Shop the Collection
      </h2>

      {/* Category pills — horizontally scrollable on mobile, wraps on desktop */}
      <div
        role="tablist"
        aria-label="Product categories"
        className="-mx-4 flex gap-2.5 overflow-x-auto scroll-smooth px-4 pb-3 sm:mx-0 sm:flex-wrap sm:px-0 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {CATEGORY_TABS.map((tab, i) => {
          const isActive = i === active;
          return (
            <button
              key={tab.label}
              ref={(el) => {
                chipRefs.current[i] = el;
              }}
              role="tab"
              aria-selected={isActive}
              onClick={() => selectTab(i)}
              className={[
                'shrink-0 whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-300 ease-out min-h-touch',
                isActive
                  ? 'bg-gradient-to-r from-nike-ink to-nike-charcoal text-white shadow-lg shadow-black/20 -translate-y-0.5'
                  : 'bg-nike-cloud text-nike-ink hover:bg-nike-hairline-soft hover:-translate-y-0.5',
              ].join(' ')}
            >
              {tab.label}
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
