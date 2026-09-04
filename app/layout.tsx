import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '공통수학2 탐구실 | 생기부 탐구 주제 찾기',
  description:
    '2022 개정 교육과정 공통수학2의 소단원별 탐구 주제, 탐구 방향, 진로와 교과 연계를 찾아보세요.',
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
      <body>{children}</body>
    </html>
  );
}
