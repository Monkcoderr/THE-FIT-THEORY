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
