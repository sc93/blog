import type { Metadata } from 'next';

import { siteConfig } from '@/lib/config';
import { fontVariables } from '@/lib/fonts';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/shadcn-ui/sonner';
import { ThemeProvider } from '@/components/layout/theme-provider';
import { TailwindIndicator } from '@/components/shared/tailwind-indicator';

import '@/styles/globals.css';

interface RootLayoutProps {
  children: React.ReactNode;
}

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  metadataBase: new URL(siteConfig.url),
  description: siteConfig.description,
  alternates: {
    types: {
      'application/rss+xml': [
        {
          url: '/rss.xml',
          title: `${siteConfig.name} RSS`,
        },
      ],
    },
  },
  keywords: ['Next.js', 'React', 'Tailwind CSS', 'shadcn-ui', 'MDX'],
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [siteConfig.ogImage],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: `${siteConfig.url}/site.webmanifest`,
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          'text-foreground overscroll-none font-sans antialiased',
          fontVariables
        )}
      >
        <ThemeProvider>
          {children}
          <TailwindIndicator />
          <Toaster position="top-center" />
        </ThemeProvider>
      </body>
    </html>
  );
}
