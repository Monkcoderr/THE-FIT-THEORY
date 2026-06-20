'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  Boxes,
  BarChart3,
  LogOut,
  Store,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMobileMenu } from '@/hooks/useMobileMenu';
import { toast } from '@/components/ui/Toast';

const NAV_ITEMS = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/inventory', label: 'Inventory', icon: Boxes },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { open, close } = useMobileMenu();

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  async function handleLogout() {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      toast.success('Signed out');
      router.push('/admin/login');
      router.refresh();
    } catch {
      toast.error('Could not sign out');
    }
  }

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={close}
          aria-hidden
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-admin-border bg-admin-surface transition-transform duration-300 lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Brand */}
        <div className="flex h-16 items-center justify-between border-b border-admin-border px-5">
          <Link
            href="/admin"
            className="flex items-center gap-2"
            onClick={close}
          >
            <span className="text-lg font-bold tracking-tight text-admin-text">
              FIT<span className="text-admin-blue">.</span>THEORY
            </span>
          </Link>
          <button
            onClick={close}
            className="flex h-9 w-9 items-center justify-center rounded-md text-admin-text-soft hover:bg-admin-surface-2 lg:hidden"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-3 admin-scroll">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.href, item.exact);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={close}
                className={cn(
                  'relative flex h-11 items-center gap-3 rounded-md px-3 text-sm font-medium transition-colors',
                  active
                    ? 'bg-admin-surface-2 text-admin-text'
                    : 'text-admin-text-soft hover:bg-admin-surface-2 hover:text-admin-text'
                )}
              >
                {active && (
                  <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-admin-blue" />
                )}
                <Icon className="h-[18px] w-[18px]" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer actions */}
        <div className="space-y-1 border-t border-admin-border p-3">
          <Link
            href="/"
            target="_blank"
            className="flex h-11 items-center gap-3 rounded-md px-3 text-sm font-medium text-admin-text-soft transition-colors hover:bg-admin-surface-2 hover:text-admin-text"
          >
            <Store className="h-[18px] w-[18px]" />
            View Storefront
          </Link>
          <button
            onClick={handleLogout}
            className="flex h-11 w-full items-center gap-3 rounded-md px-3 text-sm font-medium text-admin-text-soft transition-colors hover:bg-admin-red/10 hover:text-admin-red"
          >
            <LogOut className="h-[18px] w-[18px]" />
            Sign out
          </button>
        </div>
      </aside>
    </>
  );
}
