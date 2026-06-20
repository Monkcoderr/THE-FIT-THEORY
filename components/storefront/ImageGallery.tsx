'use client';

import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface ImageGalleryProps {
  images: string[];
  alt: string;
}

export default function ImageGallery({ images, alt }: ImageGalleryProps) {
  const [active, setActive] = useState(0);
  const safeImages = images.length ? images : [];

  if (safeImages.length === 0) {
    return (
      <div className="aspect-square w-full rounded-lg bg-nike-cloud" />
    );
  }

  return (
    <div className="flex flex-col gap-4 lg:flex-row-reverse">
      {/* Main image */}
      <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-nike-cloud lg:flex-1">
        <Image
          src={safeImages[active]}
          alt={alt}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 60vw"
          className="object-cover"
        />
      </div>

      {/* Thumbnails */}
      {safeImages.length > 1 && (
        <div className="flex gap-3 overflow-x-auto no-scrollbar lg:flex-col lg:overflow-visible">
          {safeImages.map((src, i) => (
            <button
              key={src}
              onClick={() => setActive(i)}
              className={cn(
                'relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-nike-cloud transition-all lg:h-20 lg:w-20',
                active === i
                  ? 'ring-2 ring-nike-ink'
                  : 'opacity-70 hover:opacity-100'
              )}
              aria-label={`View image ${i + 1}`}
            >
              <Image
                src={src}
                alt={`${alt} thumbnail ${i + 1}`}
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
