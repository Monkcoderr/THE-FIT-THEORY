import type { MetadataRoute } from 'next';

// Web App Manifest (served at /manifest.webmanifest by Next.js).
// Scope is the whole origin so both the storefront (/) and the admin CRM
// (/admin) are usable inside the installed PWA. Shortcuts give one-tap
// access to each surface from the home-screen icon.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'The Fit Theory — Athletic Wear',
    short_name: 'Fit Theory',
    description:
      'Premium athletic wear — shop the collection and order on WhatsApp. Admin CRM for inventory and sales.',
    id: '/',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#ffffff',
    theme_color: '#111111',
    categories: ['shopping', 'lifestyle', 'business'],
    icons: [
      {
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/maskable-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icons/maskable-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    shortcuts: [
      {
        name: 'Shop the Collection',
        short_name: 'Shop',
        url: '/shop',
        icons: [{ src: '/icons/icon-192.png', sizes: '192x192' }],
      },
      {
        name: 'Admin Dashboard',
        short_name: 'Admin',
        url: '/admin',
        icons: [{ src: '/icons/icon-192.png', sizes: '192x192' }],
      },
    ],
  };
}
