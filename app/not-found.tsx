import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4 text-center">
      <p className="text-sm font-medium uppercase tracking-widest text-nike-mute">
        Error 404
      </p>
      <h1 className="mt-3 text-6xl font-extrabold uppercase tracking-tight text-nike-ink sm:text-8xl">
        Off Track
      </h1>
      <p className="mt-4 max-w-md text-base text-nike-mute">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
        Let&apos;s get you back in the game.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="inline-flex h-12 items-center justify-center rounded-full bg-nike-ink px-8 text-base font-medium text-white transition-transform hover:scale-[1.02] active:scale-[0.98]"
        >
          Back to home
        </Link>
        <Link
          href="/shop"
          className="inline-flex h-12 items-center justify-center rounded-full border border-nike-hairline px-8 text-base font-medium text-nike-ink transition-colors hover:border-nike-ink"
        >
          Shop the collection
        </Link>
      </div>
    </div>
  );
}
