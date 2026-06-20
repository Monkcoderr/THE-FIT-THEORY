'use client';

import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import ProductUploadForm from '@/components/admin/ProductUploadForm';

export default function NewProductPage() {
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
          New product
        </h2>
        <p className="text-sm text-admin-mute">
          Add a new item to your catalog.
        </p>
      </div>

      <ProductUploadForm mode="create" />
    </div>
  );
}
