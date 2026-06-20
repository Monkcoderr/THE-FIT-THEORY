import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden bg-black h-[200px] sm:h-[260px] md:h-[300px] lg:h-auto lg:aspect-[1717/916]">
      <Link href="/shop" className="group block w-full h-full">
        <picture className="w-full h-full">
          <source media="(max-width: 768px)" srcSet="/banner-mobile.webp" />
          <img
            src="/banner-desktop.webp"
            alt="The Fit Theory Banner"
            className="w-full h-full object-contain lg:object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
            loading="eager"
          />
        </picture>
        {/* Subtle overlay on hover */}
        <div className="absolute inset-0 bg-black/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none" />
      </Link>
    </section>
  );
}

