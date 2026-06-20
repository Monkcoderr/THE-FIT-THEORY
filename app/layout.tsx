import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'sonner';
import PWARegister from '@/components/PWARegister';
import InstallPrompt from '@/components/InstallPrompt';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const RAW_SITE_URL =
  process.env.NEXT_PUBLIC_SHOP_URL ?? 'https://thefittheory.vercel.app';

// Tolerate a misconfigured env value (e.g. missing protocol) so it can never
// break the production build via `new URL(...)`.
function safeMetadataBase(value: string): URL {
  const candidates = [value, `https://${value}`, 'https://thefittheory.vercel.app'];
  for (const c of candidates) {
    try {
      return new URL(c);
    } catch {
      /* try next */
    }
  }
  return new URL('https://thefittheory.vercel.app');
}

export const metadata: Metadata = {
  metadataBase: safeMetadataBase(RAW_SITE_URL),
  applicationName: 'The Fit Theory',
  title: {
    default: 'The Fit Theory — Athletic Wear',
    template: '%s | The Fit Theory',
  },
  description:
    'Premium athletic wear — dry-fit jerseys, trousers, polos, and compression gear built for performance. Shop the collection and order on WhatsApp.',
  keywords: [
    'athletic wear',
    'dry-fit',
    'football jersey',
    'gym wear',
    'compression',
    'sportswear',
  ],
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Fit Theory',
  },
  icons: {
    icon: [
      { url: '/favicon.png', type: 'image/png' },
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/icons/apple-touch-icon.png', sizes: '180x180' }],
  },
  openGraph: {
    title: 'The Fit Theory — Athletic Wear',
    description: 'Premium athletic wear built for performance.',
    type: 'website',
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  // Allow pinch-zoom for accessibility; cover the full screen incl. notch.
  maximumScale: 5,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#111111' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">
        {children}
        <PWARegister />
        <InstallPrompt />
        <Toaster
          position="top-center"
          richColors
          closeButton
          toastOptions={{
            style: { fontFamily: 'var(--font-inter), system-ui, sans-serif' },
          }}
        />
      </body>
    </html>
  );
}
