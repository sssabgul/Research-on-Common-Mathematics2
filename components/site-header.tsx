import { CheckCircle2, Search, Shapes } from 'lucide-react';
import Link from 'next/link';

import { SITE_NAME } from '@/lib/site';

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-black/[0.06] bg-white/80 backdrop-blur-2xl supports-[backdrop-filter]:bg-white/72 print:hidden">
      <div className="safe-area-x mx-auto flex h-[64px] max-w-[1180px] items-center justify-between gap-3 sm:h-[72px]">
        <Link
          href="/"
          className="flex min-w-0 items-center gap-3 rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#007aff]"
        >
          <span className="flex size-10 shrink-0 items-center justify-center rounded-[13px] bg-[#007aff] text-white shadow-[0_4px_14px_rgb(0_122_255/24%)]">
            <Shapes className="size-5" aria-hidden="true" />
          </span>
          <span className="truncate text-[17px] font-bold tracking-[-0.02em]">
            {SITE_NAME}
          </span>
        </Link>

        <div className="flex shrink-0 items-center gap-2">
          <Link
            href="/#search"
            className="inline-flex min-h-11 items-center gap-1.5 rounded-full px-3 text-[14px] font-bold text-[#3a3a3c] transition-colors hover:bg-[#f2f2f7] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#007aff]"
          >
            <Search className="size-4" aria-hidden="true" />
            주제 검색
          </Link>
          <span className="hidden items-center gap-1.5 rounded-full bg-[#e8f2ff] px-3 py-1.5 text-[13px] font-semibold text-[#0066cc] lg:flex">
            <CheckCircle2 className="size-4" aria-hidden="true" />
            2022 개정 교육과정
          </span>
        </div>
      </div>
    </header>
  );
}
