import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'sonner';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
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
  themeColor: '#111111',
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
