import { ExternalLink, SquarePen } from 'lucide-react';

export function ReportFormButton({ href }: { href: string }) {
  const className =
    'inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#0066cc] px-4 py-2 text-[14px] font-bold text-white transition-colors hover:bg-[#0055aa] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#007aff] print:hidden';

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      data-report-form="ready"
      className={className}
    >
      <SquarePen className="size-4" aria-hidden="true" />
      탐구계획서 작성
      <ExternalLink className="size-3.5" aria-hidden="true" />
      <span className="sr-only"> (새 탭)</span>
    </a>
  );
}
