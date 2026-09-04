import { ArrowUp } from 'lucide-react';

import { SITE_NAME } from '@/lib/site';

export function SiteFooter() {
  return (
    <footer className="safe-area-bottom border-t border-black/[0.06] bg-white/70 px-4 py-8 text-center text-[14px] text-[#8e8e93] print:hidden">
      <p>{SITE_NAME} · 주제는 자신의 질문과 활동에 맞게 발전시켜 사용하세요.</p>
      <a
        href="#main"
        className="mx-auto mt-3 inline-flex min-h-11 items-center gap-1.5 rounded-full px-4 font-bold text-[#007aff] hover:bg-[#eef6ff] focus-visible:outline-2 focus-visible:outline-[#007aff]"
      >
        맨 위로 <ArrowUp className="size-4" aria-hidden="true" />
      </a>
    </footer>
  );
}
