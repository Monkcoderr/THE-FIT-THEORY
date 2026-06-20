'use client';

import useSWR from 'swr';
import type { Product } from '@/types';

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error ?? 'Failed to load inventory');
  }
  return res.json();
};

// Inventory uses the same products endpoint (admin scope) but is a
// distinct SWR key so it revalidates independently after stock changes.
export function useInventory() {
  const { data, error, isLoading, mutate } = useSWR<{ products: Product[] }>(
    '/api/products?all=true',
    fetcher,
    { revalidateOnFocus: true }
  );

  return {
    products: data?.products ?? [],
    isLoading,
    isError: !!error,
    mutate,
  };
}
