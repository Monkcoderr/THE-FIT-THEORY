// Central store identity used on invoices and WhatsApp messages.
// Values fall back to sensible defaults; override via NEXT_PUBLIC_* env vars.

export const STORE = {
  name: process.env.NEXT_PUBLIC_STORE_NAME ?? 'The Fit Theory',
  tagline: process.env.NEXT_PUBLIC_STORE_TAGLINE ?? 'TFT Sportswear',
  phone: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '',
  address: process.env.NEXT_PUBLIC_STORE_ADDRESS ?? '',
  email: process.env.NEXT_PUBLIC_STORE_EMAIL ?? '',
} as const;

// Pretty-print the store phone with a leading + when it looks international.
export function formatStorePhone(): string {
  if (!STORE.phone) return '';
  return STORE.phone.startsWith('+') ? STORE.phone : `+${STORE.phone}`;
}
