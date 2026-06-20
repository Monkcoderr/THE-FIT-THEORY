'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

const LINKS = [
  { href: '/shop', label: 'Shop All' },
  { href: '/shop?sport=Football', label: 'Football' },
  { href: '/shop?sport=Gym%2FLifting', label: 'Gym' },
  { href: '/shop?category=Jersey', label: 'Jerseys' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Transparent over hero on homepage; solid elsewhere or after scroll.
  const isHome = pathname === '/';
  const solid = scrolled || !isHome || mobileOpen;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-40 transition-colors duration-300',
        solid
          ? 'border-b border-nike-hairline-soft bg-white'
          : 'bg-transparent'
      )}
    >
      <nav className="mx-auto flex h-14 max-w-nike items-center justify-between px-4 sm:px-6">
        {/* Left: mobile menu + logo */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileOpen((o) => !o)}
            className={cn(
              'flex h-10 w-10 items-center justify-center rounded-full md:hidden',
              solid ? 'text-nike-ink' : 'text-white'
            )}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
          <Link
            href="/"
            className={cn(
              'text-lg font-extrabold uppercase tracking-tight',
              solid || mobileOpen ? 'text-nike-ink' : 'text-white'
            )}
          >
            The Fit Theory
          </Link>
        </div>

        {/* Center: desktop links */}
        <div className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className={cn(
                'text-sm font-medium transition-opacity hover:opacity-60',
                solid ? 'text-nike-ink' : 'text-white'
              )}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Right: search */}
        <Link
          href="/shop"
          aria-label="Search products"
          className={cn(
            'flex h-10 w-10 items-center justify-center rounded-full transition-colors',
            solid
              ? 'text-nike-ink hover:bg-nike-cloud'
              : 'text-white hover:bg-white/10'
          )}
        >
          <Search className="h-5 w-5" />
        </Link>
      </nav>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="border-t border-nike-hairline-soft bg-white md:hidden">
          <div className="flex flex-col px-4 py-2">
            {LINKS.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className="border-b border-nike-hairline-soft py-4 text-base font-medium text-nike-ink last:border-0"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
