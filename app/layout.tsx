import type { Metadata, Viewport } from 'next';

import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/lib/site';
import './globals.css';

const defaultTitle = `${SITE_NAME} | 생기부 탐구 주제 찾기`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: defaultTitle,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  icons: { icon: '/favicon.svg' },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    siteName: SITE_NAME,
    url: SITE_URL,
    title: defaultTitle,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: 'summary',
    title: defaultTitle,
    description: SITE_DESCRIPTION,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#f2f2f7',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <div className="min-h-screen bg-[#f2f2f7] text-[#1c1c1e]">
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-[#007aff] focus:px-4 focus:py-2 focus:font-bold focus:text-white"
          >
            본문 바로가기
          </a>
          <SiteHeader />
          <main
            id="main"
            // 본문 바로가기로 이동했을 때 포커스가 실제로 여기 머물도록.
            tabIndex={-1}
            className="safe-area-x mx-auto max-w-[1180px] pt-10 pb-20 focus:outline-none sm:pt-14"
          >
            {children}
          </main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
