import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'EliteBooks — AI-Powered Accounting',
    template: '%s | EliteBooks',
  },
  description: 'AI-native autonomous accounting platform. Automated bookkeeping, invoicing, payroll, expenses, and financial intelligence for modern businesses.',
  keywords: ['accounting', 'AI', 'bookkeeping', 'invoicing', 'payroll', 'expenses', 'financial intelligence', 'automation'],
  authors: [{ name: 'EliteBooks' }],
  creator: 'EliteBooks',
  metadataBase: new URL('https://elitebooks.us'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'EliteBooks',
    title: 'EliteBooks — AI-Powered Accounting',
    description: 'Accounting that runs itself, explained simply. AI agents handle your bookkeeping, invoicing, payroll, and reporting automatically.',
    images: [
      {
        url: 'https://elitebooks.us/NewIcon.png',
        width: 1024,
        height: 1024,
        alt: 'EliteBooks AI-Powered Accounting',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EliteBooks — AI-Powered Accounting',
    description: 'Accounting that runs itself, explained simply.',
    images: ['https://elitebooks.us/NewIcon.png'],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'EliteBooks',
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: '/NewIcon.png',
    apple: '/NewIcon.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#3b82f6',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
};

import { AuthProvider } from '@/hooks/useAuth';
import AIAssistant from '@/components/AIAssistant';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <AuthProvider>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'Organization',
                name: 'EliteBooks',
                url: 'https://elitebooks.us',
                logo: 'https://elitebooks.us/NewIcon.png',
                description: 'AI-native autonomous accounting platform.',
              }),
            }}
          />
          {children}
          <AIAssistant />
        </AuthProvider>
      </body>
    </html>
  );
}
