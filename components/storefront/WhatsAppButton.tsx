'use client';

import { MessageCircle } from 'lucide-react';
import type { Product } from '@/types';
import { generateWhatsAppURL } from '@/lib/whatsapp';
import { cn } from '@/lib/utils';
import { toast } from '@/components/ui/Toast';

interface WhatsAppButtonProps {
  product: Product;
  selectedSize: string | null;
  className?: string;
}

// Green WhatsApp CTA that builds a pre-filled inquiry with product details.
export default function WhatsAppButton({
  product,
  selectedSize,
  className,
}: WhatsAppButtonProps) {
  function handleClick(e: React.MouseEvent) {
    if (!selectedSize) {
      e.preventDefault();
      toast.error('Please select a size first');
      return;
    }
  }

  const href = selectedSize
    ? generateWhatsAppURL({
        productTitle: product.title,
        selectedSize,
        price: product.price,
        productSlug: product.slug,
        category: product.category,
        fabric: product.fabric,
      })
    : '#';

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className={cn(
        'inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#25D366] text-base font-medium text-white transition-transform hover:scale-[1.01] active:scale-[0.99]',
        className
      )}
    >
      <MessageCircle className="h-5 w-5" />
      Order on WhatsApp
    </a>
  );
}
