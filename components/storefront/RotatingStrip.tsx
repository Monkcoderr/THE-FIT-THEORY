'use client';

export default function RotatingStrip() {
  const items = [
    { text: 'Made In India', icon: '🇮🇳' },
    { text: '2.5L+ Happy Customers', icon: '❤️' },
    { text: 'Easy 7-Day Exchange', icon: '🔄' },
    { text: 'Super Fast Delivery', icon: '⚡' },
    { text: 'Secure & Trusted Payments', icon: '🛡️' },
    { text: 'Limited Stock', icon: '🔥' },
  ];

  // Duplicate items array multiple times to ensure seamless infinite looping on all screen sizes
  const loopItems = [...items, ...items, ...items, ...items];

  return (
    <div className="relative w-full overflow-hidden bg-black py-3 border-y border-zinc-800">
      <style>{`
        @keyframes marquee {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-50%, 0, 0);
          }
        }
        .animate-marquee-strip {
          display: flex;
          width: max-content;
          animation: marquee 25s linear infinite;
        }
        .animate-marquee-strip:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div className="flex w-full overflow-hidden">
        <div className="animate-marquee-strip flex items-center gap-16 whitespace-nowrap pr-16">
          {loopItems.map((item, index) => (
            <div key={index} className="flex items-center gap-2.5">
              <span className="text-base sm:text-lg select-none leading-none">{item.icon}</span>
              <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white">
                {item.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
