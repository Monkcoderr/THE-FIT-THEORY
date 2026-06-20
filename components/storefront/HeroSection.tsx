export default function HeroSection() {
  return (
    <section className="relative flex min-h-[280px] sm:min-h-[300px] lg:min-h-[30vh] items-center overflow-hidden bg-nike-ink">
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
      <div className="relative z-10 mx-auto w-full max-w-nike px-4 pt-20 pb-8 sm:px-6 sm:pt-24 sm:pb-12 lg:py-10">
        <div className="grid gap-6 md:grid-cols-12 md:items-center">
          {/* Left Column: Heading */}
          <div className="md:col-span-7">
            <p className="mb-2 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-white/70">
              New Season · Built for Performance
            </p>
            <h1 className="text-3xl font-extrabold uppercase leading-none tracking-tight text-white sm:text-5xl lg:text-6xl">
              Engineered
              <br className="hidden sm:inline" /> to Move.
            </h1>
          </div>

          {/* Right Column: Description */}
          <div className="md:col-span-5 flex flex-col justify-center">
            <p className="text-xs sm:text-sm text-white/80 leading-relaxed max-w-md">
              Dry-fit jerseys, compression gear, and training essentials. Designed
              for athletes who refuse to slow down.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
