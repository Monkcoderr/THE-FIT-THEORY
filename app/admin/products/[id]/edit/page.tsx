'use client';

import Link from 'next/link';
import { ChevronLeft, Loader2, AlertCircle } from 'lucide-react';
import { useProduct } from '@/hooks/useProducts';
import ProductUploadForm from '@/components/admin/ProductUploadForm';

export default function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  const { product, isLoading, isError } = useProduct(params.id);

  return (
    <div className="space-y-5">
      <div>
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-1 text-sm text-admin-text-soft transition-colors hover:text-admin-text"
        >
          <ChevronLeft className="h-4 w-4" /> Back to products
        </Link>
        <h2 className="mt-2 text-xl font-semibold text-admin-text">
          Edit product
        </h2>
        <p className="text-sm text-admin-mute">
          {product ? product.title : 'Update product details and stock.'}
        </p>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-admin-blue" />
        </div>
      )}

      {isError && !isLoading && (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-admin-border py-16 text-center">
          <AlertCircle className="h-8 w-8 text-admin-red" />
          <p className="mt-2 text-sm text-admin-text">
            Could not load this product.
          </p>
          <Link
            href="/admin/products"
            className="mt-3 text-sm text-admin-blue hover:underline"
          >
            Return to products
          </Link>
        </div>
      )}

      {product && !isLoading && (
        <ProductUploadForm mode="edit" initial={product} />
      )}
    </div>
  );
}
