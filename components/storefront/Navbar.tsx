'use client';

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Menu, X, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

const LINKS = [
  { href: '/shop', label: 'Shop All' },
  { href: '/shop?category=Trousers', label: 'Trousers' },
  { href: '/shop?category=T-Shirt', label: 'T-Shirts' },
  { href: '/shop?category=Jersey', label: 'Jerseys' },
  { href: '/shop?category=Polo', label: 'Polo T-Shirts' },
  { href: '/shop?category=Caps', label: 'Caps' },
  { href: '/shop?category=Shorts', label: 'Shorts' },
  { href: '/shop?category=Jackets', label: 'Jackets' },
  { href: '/shop?category=Others', label: 'Other Essentials' },
];

function NavbarLinks({ solid }: { solid: boolean }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (
    <div className="hidden items-center gap-2 overflow-x-auto no-scrollbar md:flex max-w-[65%] py-1">
      {LINKS.map((l) => {
        const isTabActive =
          l.href === '/shop'
            ? pathname === '/shop' && !searchParams?.get('category')
            : pathname === '/shop' &&
              searchParams?.get('category') === l.href.split('category=')[1];
        return (
          <Link
            key={l.label}
            href={l.href}
            className={cn(
              'shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all',
              isTabActive
                ? solid
                  ? 'bg-nike-ink text-white'
                  : 'bg-white text-nike-ink'
                : solid
                  ? 'bg-nike-cloud text-nike-charcoal hover:bg-nike-hairline-soft hover:text-nike-ink'
                  : 'bg-white/10 text-white hover:bg-white/20'
            )}
          >
            {l.label}
          </Link>
        );
      })}
    </div>
  );
}

function MobileNavbarLinks() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (
    <div className="flex flex-col px-4 py-2 max-h-[80vh] overflow-y-auto">
      {LINKS.map((l) => {
        const isTabActive =
          l.href === '/shop'
            ? pathname === '/shop' && !searchParams?.get('category')
            : pathname === '/shop' &&
              searchParams?.get('category') === l.href.split('category=')[1];
        return (
          <Link
            key={l.label}
            href={l.href}
            className={cn(
              'border-b border-nike-hairline-soft py-4 text-base font-medium transition-colors last:border-0',
              isTabActive ? 'text-nike-ink font-bold' : 'text-nike-mute'
            )}
          >
            {l.label}
          </Link>
        );
      })}
    </div>
  );
}

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
        'safe-top fixed inset-x-0 top-0 z-40 transition-colors duration-300',
        solid ? 'border-b border-nike-hairline-soft bg-white' : 'bg-transparent'
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
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
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
        <Suspense fallback={<div className="hidden md:flex min-w-[300px]" />}>
          <NavbarLinks solid={solid} />
        </Suspense>

        {/* Right: search */}
        <Link
          href="/shop"
          aria-label="Search products"
          className={cn(
            'flex h-10 w-10 items-center justify-center rounded-full transition-colors',
            solid ? 'text-nike-ink hover:bg-nike-cloud' : 'text-white hover:bg-white/10'
          )}
        >
          <Search className="h-5 w-5" />
        </Link>
      </nav>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="border-t border-nike-hairline-soft bg-white md:hidden">
          <Suspense fallback={<div className="h-40" />}>
            <MobileNavbarLinks />
          </Suspense>
        </div>
      )}
    </header>
  );
}
