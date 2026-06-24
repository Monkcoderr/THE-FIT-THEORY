'use client';

import useSWR from 'swr';
import type { Invoice } from '@/types';

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error ?? 'Failed to load invoices');
  }
  return res.json();
};

export interface InvoiceQuery {
  search?: string;
  from?: string;
  to?: string;
  status?: 'completed' | 'cancelled';
  limit?: number;
}

function buildQuery(q: InvoiceQuery): string {
  const params = new URLSearchParams();
  if (q.search) params.set('search', q.search);
  if (q.from) params.set('from', q.from);
  if (q.to) params.set('to', q.to);
  if (q.status) params.set('status', q.status);
  if (q.limit) params.set('limit', String(q.limit));
  const qs = params.toString();
  return qs ? `?${qs}` : '';
}

export function useInvoices(query: InvoiceQuery = {}) {
  const url = `/api/invoices${buildQuery(query)}`;
  const { data, error, isLoading, mutate } = useSWR<{ invoices: Invoice[] }>(
    url,
    fetcher,
    { revalidateOnFocus: false }
  );

  return {
    invoices: data?.invoices ?? [],
    isLoading,
    isError: !!error,
    error: error as Error | undefined,
    mutate,
  };
}
