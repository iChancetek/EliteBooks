import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Server-side packages that shouldn't be bundled for the client
  serverExternalPackages: ['firebase-admin'],

  // Image optimization
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.googleusercontent.com' },
      { protocol: 'https', hostname: '*.firebasestorage.googleapis.com' },
    ],
  },
};

export default nextConfig;
