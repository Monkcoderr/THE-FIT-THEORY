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
