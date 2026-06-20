'use client';

import useSWR from 'swr';
import type { AnalyticsData } from '@/types';

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error ?? 'Failed to load analytics');
  }
  return res.json();
};

export function useAnalytics() {
  const { data, error, isLoading, mutate } = useSWR<AnalyticsData>(
    '/api/analytics',
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
