// WhatsApp URL constructor — generates pre-filled inquiry messages

interface WhatsAppParams {
  productTitle: string;
  selectedSize: string;
  price: number;
  productSlug: string;
  category: string;
  fabric: string;
}

export function generateWhatsAppURL(params: WhatsAppParams): string {
  const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  const shopURL = process.env.NEXT_PUBLIC_SHOP_URL ?? '';

  if (!phoneNumber) {
    console.error('NEXT_PUBLIC_WHATSAPP_NUMBER is not defined');
    return '#';
  }

  const productURL = `${shopURL}/shop/${params.productSlug}`;

  const message = [
    `Hi! I'm interested in ordering the following item:`,
    ``,
    `🏷️ *Product:* ${params.productTitle}`,
    `📦 *Category:* ${params.category} (${params.fabric})`,
    `📐 *Size:* ${params.selectedSize}`,
    `💰 *Price:* ₹${params.price.toLocaleString('en-IN')}`,
    ``,
    `🔗 *Link:* ${productURL}`,
    ``,
    `Could you please confirm availability? Thank you!`,
  ].join('\n');

  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
}

// Generate URL for general inquiry (no specific product)
export function generateGeneralWhatsAppURL(): string {
  const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  if (!phoneNumber) return '#';
  const message = encodeURIComponent(
    "Hi! I'd like to know more about your athletic wear collection."
  );
  return `https://wa.me/${phoneNumber}?text=${message}`;
}

// ─── Invoice / billing ───

import type { Invoice } from '@/types';
import { STORE, formatStorePhone } from '@/lib/store';
import { normalizeMobile } from '@/lib/invoice';

function rupees(n: number): string {
  return `₹${n.toLocaleString('en-IN')}`;
}

/**
 * Build the plain-text invoice message sent to a customer over WhatsApp.
 */
export function buildInvoiceMessage(invoice: Invoice): string {
  const lines: string[] = [];
  lines.push(`Thank you for shopping with ${STORE.name}! 🙏`);
  lines.push('');
  lines.push(`🧾 *Invoice:* ${invoice.invoiceNumber}`);
  if (invoice.customerName) {
    lines.push(`👤 *Customer:* ${invoice.customerName}`);
  }
  lines.push('');
  lines.push('*Order details:*');
  invoice.items.forEach((it) => {
    lines.push(
      `• ${it.productName} (${it.size}) × ${it.quantity} — ${rupees(
        it.totalPrice
      )}`
    );
  });
  lines.push('');
  lines.push(`Subtotal: ${rupees(invoice.subtotal)}`);
  if (invoice.discountAmount > 0) {
    lines.push(`Discount: -${rupees(invoice.discountAmount)}`);
  }
  lines.push(`*Total Paid: ${rupees(invoice.finalAmount)}*`);
  lines.push(`Payment: ${invoice.paymentMethod}`);
  lines.push('');
  const phone = formatStorePhone();
  if (phone) lines.push(`📞 ${phone}`);
  if (STORE.address) lines.push(`📍 ${STORE.address}`);
  lines.push('');
  lines.push('See you again soon! 💪');
  return lines.join('\n');
}

/**
 * Generate a wa.me deep link addressed to the *customer's* number, pre-filled
 * with their invoice. Staff taps it to send the bill from their own WhatsApp.
 */
export function generateInvoiceWhatsAppURL(invoice: Invoice): string {
  const mobile = normalizeMobile(invoice.customerMobile);
  // Assume Indian numbers (country code 91) when a bare 10-digit number is given.
  const target = mobile.length === 10 ? `91${mobile}` : mobile;
  const text = encodeURIComponent(buildInvoiceMessage(invoice));
  return `https://wa.me/${target}?text=${text}`;
}
