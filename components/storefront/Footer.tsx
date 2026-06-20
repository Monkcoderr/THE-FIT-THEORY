import Link from 'next/link';
import { generateGeneralWhatsAppURL } from '@/lib/whatsapp';

const COLUMNS = [
  {
    title: 'Shop',
    links: [
      { label: 'All Products', href: '/shop' },
      { label: 'Jerseys', href: '/shop?category=Jersey' },
      { label: 'Compression', href: '/shop?category=Compression' },
      { label: 'Trousers', href: '/shop?category=Trousers' },
    ],
  },
  {
    title: 'Sports',
    links: [
      { label: 'Football', href: '/shop?sport=Football' },
      { label: 'Running', href: '/shop?sport=Running' },
      { label: 'Gym / Lifting', href: '/shop?sport=Gym%2FLifting' },
      { label: 'Cricket', href: '/shop?sport=Cricket' },
    ],
  },
];

export default function Footer() {
  const year = new Date().getFullYear();
  const waUrl = generateGeneralWhatsAppURL();

  return (
    <footer className="border-t border-nike-hairline bg-white">
      <div className="mx-auto max-w-nike px-4 py-12 sm:px-6">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <h3 className="text-lg font-extrabold uppercase tracking-tight text-nike-ink">
              The Fit Theory
            </h3>
            <p className="mt-2 max-w-xs text-sm text-nike-mute">
              Performance athletic wear. Browse online, order on WhatsApp, pick
              up in store.
            </p>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-medium text-nike-ink">{col.title}</h4>
              <ul className="mt-3 space-y-2">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-nike-mute transition-colors hover:text-nike-ink"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h4 className="text-sm font-medium text-nike-ink">Contact</h4>
            <ul className="mt-3 space-y-2">
              <li>
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-nike-mute transition-colors hover:text-nike-ink"
                >
                  WhatsApp us
                </a>
              </li>
              <li>
                <Link
                  href="/shop"
                  className="text-sm text-nike-mute transition-colors hover:text-nike-ink"
                >
                  Browse catalog
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-2 border-t border-nike-hairline-soft pt-6 sm:flex-row sm:items-center">
          <p className="text-xs text-nike-mute">
            © {year} The Fit Theory. All rights reserved.
          </p>
          <p className="text-xs text-nike-stone">
            Online-to-Offline athletic wear.
          </p>
        </div>
      </div>
    </footer>
  );
}
