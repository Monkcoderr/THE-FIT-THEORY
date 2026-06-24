'use client';

import useSWR from 'swr';
import type { SalesAnalyticsData } from '@/types';

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error ?? 'Failed to load sales analytics');
  }
  return res.json();
};

export function useSalesAnalytics() {
  const { data, error, isLoading, mutate } = useSWR<SalesAnalyticsData>(
    '/api/sales-analytics',
    fetcher,
    { revalidateOnFocus: false }
  );

  return {
    data,
    isLoading,
    isError: !!error,
    mutate,
  };
}
