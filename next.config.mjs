/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
  },
  experimental: {
    serverComponentsExternalPackages: ['mongoose'],
  },
  async headers() {
    return [
      {
        // Never let the browser serve a stale service worker — always
        // revalidate so PWA updates propagate immediately on deploy.
        source: '/sw.js',
        headers: [
          { key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' },
          { key: 'Service-Worker-Allowed', value: '/' },
        ],
      },
      {
        source: '/offline.html',
        headers: [{ key: 'Cache-Control', value: 'no-cache' }],
      },
    ];
  },
  webpack: (config, { dev }) => {
    // In development, use an in-memory webpack cache instead of the
    // on-disk gzip PackFileCache. The disk cache corrupts and throws
    // "Array buffer allocation failed" when the project lives on a
    // synced folder (Dropbox/OneDrive). Memory cache is fast and safe.
    if (dev) {
      config.cache = { type: 'memory' };
    }
    return config;
  },
};

export default nextConfig;
