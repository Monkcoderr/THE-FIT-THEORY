'use client';

import { usePathname } from 'next/navigation';
import { Menu, Plus } from 'lucide-react';
import Link from 'next/link';
import { useMobileMenu } from '@/hooks/useMobileMenu';

const TITLES: { match: (p: string) => boolean; title: string }[] = [
  { match: (p) => p === '/admin', title: 'Dashboard' },
  { match: (p) => p.startsWith('/admin/products'), title: 'Products' },
  { match: (p) => p.startsWith('/admin/inventory'), title: 'Inventory' },
  { match: (p) => p.startsWith('/admin/analytics'), title: 'Analytics' },
];

export default function AdminHeader() {
  const pathname = usePathname();
  const { toggle } = useMobileMenu();
  const current = TITLES.find((t) => t.match(pathname))?.title ?? 'Admin';

  return (
    <header className="safe-top sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-admin-border bg-admin-bg/80 px-4 backdrop-blur-md lg:px-8">
      <div className="flex items-center gap-3">
        <button
          onClick={toggle}
          className="flex h-10 w-10 items-center justify-center rounded-md text-admin-text-soft hover:bg-admin-surface-2 lg:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="text-base font-semibold text-admin-text">{current}</h1>
      </div>

      <Link
        href="/admin/products/new"
        className="inline-flex h-10 items-center gap-1.5 rounded-md bg-admin-blue px-3.5 text-sm font-medium text-white transition-colors hover:bg-admin-blue-hover"
      >
        <Plus className="h-4 w-4" />
        <span className="hidden sm:inline">New Product</span>
        <span className="sm:hidden">New</span>
      </Link>
    </header>
  );
}
