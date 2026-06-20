'use client';

import useSWR from 'swr';
import type { Product } from '@/types';

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error ?? 'Failed to load products');
  }
  return res.json();
};

export function useProducts(query = '') {
  const url = `/api/products?all=true${query ? `&${query}` : ''}`;
  const { data, error, isLoading, mutate } = useSWR<{ products: Product[] }>(
    url,
    fetcher
  );

  return {
    products: data?.products ?? [],
    isLoading,
    isError: !!error,
    error: error as Error | undefined,
    mutate,
  };
}

export function useProduct(id?: string) {
  const { data, error, isLoading, mutate } = useSWR<{ product: Product }>(
    id ? `/api/products/${id}` : null,
    fetcher
  );

  return {
    product: data?.product,
    isLoading,
    isError: !!error,
    mutate,
  };
}
