'use client';

import { Printer } from 'lucide-react';

/** 인쇄용 스타일은 globals.css의 `@media print`가 담당한다. */
export function PrintButton({ className = '' }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className={`inline-flex min-h-11 items-center gap-2 rounded-full border border-black/[0.08] bg-white px-4 text-[14px] font-bold text-[#3a3a3c] transition-colors hover:bg-[#f2f2f7] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#007aff] print:hidden ${className}`}
    >
      <Printer className="size-4" aria-hidden="true" />
      인쇄 · PDF로 저장
    </button>
  );
}
