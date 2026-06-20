'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useCallback } from 'react';

export const FILTER_GROUPS = [
  {
    key: 'category',
    label: 'Category',
    options: [
      'Jersey',
      'Trousers',
      'T-Shirt',
      'Polo',
      'Shorts',
      'Compression',
      'Caps',
      'Vest',
      'Others',
    ],
  },
  {
    key: 'sport',
    label: 'Sport',
    options: [
      'Football',
      'Running',
      'Gym/Lifting',
      'Cricket',
      'Basketball',
      'General',
    ],
  },
  {
    key: 'fabric',
    label: 'Fabric',
    options: [
      'Dry-Fit',
      'Cotton',
      'Mesh',
      'Polyester',
      'Cotton-Polyester Blend',
      'Nylon',
    ],
  },
  {
    key: 'fit',
    label: 'Fit',
    options: ['Compression', 'Slim', 'Regular', 'Oversized', 'Relaxed'],
  },
  {
    key: 'size',
    label: 'Size',
    options: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size'],
  },
] as const;

export type FilterKey = (typeof FILTER_GROUPS)[number]['key'];

// Shared hook for reading/writing filter state to URL query params.
export function useFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const get = useCallback(
    (key: string) => searchParams.get(key) ?? '',
    [searchParams]
  );

  const setParam = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (!value) params.delete(key);
      else params.set(key, value);
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams]
  );

  const toggle = useCallback(
    (key: string, value: string) => {
      const current = searchParams.get(key);
      setParam(key, current === value ? null : value);
    },
    [searchParams, setParam]
  );

  const clearAll = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    FILTER_GROUPS.forEach((g) => params.delete(g.key));
    params.delete('inStock');
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, [router, pathname, searchParams]);

  const activeCount = FILTER_GROUPS.reduce(
    (n, g) => n + (searchParams.get(g.key) ? 1 : 0),
    0
  );

  return { get, setParam, toggle, clearAll, activeCount, searchParams };
}
