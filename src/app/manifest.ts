import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'EliteBooks — AI-Powered Accounting',
    short_name: 'EliteBooks',
    description: 'AI-native autonomous accounting platform. Bookkeeping, invoicing, payroll, and financial intelligence — all automated.',
    start_url: '/',
    display: 'standalone',
    background_color: '#06090f',
    theme_color: '#3b82f6',
    orientation: 'portrait-primary',
    categories: ['finance', 'business', 'productivity'],
    icons: [
      {
        src: '/NewIcon.png',
        sizes: '1024x1024',
        type: 'image/png',
        purpose: 'maskable',
      }
    ],
  };
}
