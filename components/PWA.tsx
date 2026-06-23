'use client';

import { usePathname } from 'next/navigation';
import PWARegister from '@/components/PWARegister';
import InstallPrompt from '@/components/InstallPrompt';

/**
 * Renders the PWA pieces (service-worker registration + install prompt) for the
 * storefront only. The admin dashboard is intentionally excluded — it's a
 * single-operator CRM that shouldn't register a service worker or surface an
 * "Install app" prompt.
 */
export default function PWA() {
  const pathname = usePathname();

  if (pathname?.startsWith('/admin')) return null;

  return (
    <>
      <PWARegister />
      <InstallPrompt />
    </>
  );
}
