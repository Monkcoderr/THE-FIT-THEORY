'use client';

import Link from 'next/link';
import { Plus } from 'lucide-react';
import Button from '@/components/ui/Button';
import SalesStats from '@/components/admin/sales/SalesStats';
import SalesLogClient from '@/components/admin/sales/SalesLogClient';

export default function SalesLogPage() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-admin-text">Sales Log</h2>
          <p className="text-sm text-admin-mute">
            Bill customers, track sales, and share invoices.
          </p>
        </div>
        <Link href="/admin/sales/new" className="hidden sm:block">
          <Button variant="primary">
            <Plus className="h-4 w-4" /> New Sale
          </Button>
        </Link>
      </div>

      <SalesStats />
      <SalesLogClient />
    </div>
  );
}
