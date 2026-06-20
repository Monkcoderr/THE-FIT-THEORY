import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="relative flex min-h-[100svh] items-end overflow-hidden bg-nike-ink">
      {/* Atmospheric backdrop (CSS — no external image dependency) */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(120% 80% at 70% 20%, #2b2b2e 0%, #111111 55%, #050505 100%)',
        }}
      />
      <div
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            'radial-gradient(at 20% 80%, rgba(211,0,5,0.18) 0px, transparent 45%), radial-gradient(at 85% 75%, rgba(17,81,255,0.15) 0px, transparent 45%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 mx-auto w-full max-w-nike px-4 pb-16 pt-28 sm:px-6 sm:pb-24">
        <p className="mb-3 text-sm font-medium uppercase tracking-widest text-white/70">
          New Season · Built for Performance
        </p>
        <h1 className="max-w-3xl text-5xl font-extrabold uppercase leading-[0.9] tracking-tight text-white sm:text-7xl lg:text-8xl">
          Engineered
          <br />
          to Move.
        </h1>
        <p className="mt-5 max-w-md text-base text-white/80 sm:text-lg">
          Dry-fit jerseys, compression gear, and training essentials. Designed
          for athletes who refuse to slow down.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/shop"
            className="inline-flex h-12 items-center justify-center rounded-full bg-white px-8 text-base font-medium text-nike-ink transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Shop the Collection
          </Link>
          <Link
            href="/shop?sport=Football"
            className="inline-flex h-12 items-center justify-center rounded-full border border-white/40 px-8 text-base font-medium text-white transition-colors hover:bg-white/10"
          >
            Football Range
          </Link>
        </div>
      </div>
    </section>
  );
}
