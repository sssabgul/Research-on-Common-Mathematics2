import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

import type { CurriculumUnit } from '@/lib/curriculum';
import { subunitHref } from '@/lib/curriculum-utils';
import { toneStyles } from '@/lib/tone';

export function SubunitNav({
  unit,
  activeSubunitId,
}: {
  unit: CurriculumUnit;
  activeSubunitId: string;
}) {
  const styles = toneStyles[unit.tone];

  return (
    <nav
      aria-label={`${unit.title} 소단원`}
      className="overflow-hidden rounded-[1.35rem] border border-black/[0.05] bg-white shadow-[0_8px_28px_rgb(28_53_84/5%)]"
    >
      <ul className="list-none">
        {unit.subunits.map((subunit, index) => {
          const active = subunit.id === activeSubunitId;
          const last = index === unit.subunits.length - 1;
          return (
            <li key={subunit.id}>
              <Link
                href={subunitHref(unit.id, subunit.id)}
                aria-current={active ? 'page' : undefined}
                className={`relative flex min-h-[76px] w-full items-center px-4 py-3.5 text-left text-[16px] transition-colors hover:bg-[#f5f8fc] focus-visible:z-10 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#007aff] ${
                  last ? '' : 'border-b border-black/[0.06]'
                } ${active ? styles.active : 'bg-white text-[#1c1c1e]'}`}
              >
                <span
                  className={`mr-3 flex size-9 shrink-0 items-center justify-center rounded-full text-[14px] font-bold ${active ? styles.number : 'bg-[#f2f2f7] text-[#636366]'}`}
                >
                  {index + 1}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block leading-5 font-bold">
                    {subunit.label}
                  </span>
                  <span
                    className={`mt-1 block text-[13px] font-medium ${active ? 'opacity-75' : 'text-[#8e8e93]'}`}
                  >
                    주제 {subunit.topics.length}개
                  </span>
                </span>
                <ChevronRight
                  className={`ml-2 size-5 shrink-0 ${active ? 'opacity-80' : 'text-[#c7c7cc]'}`}
                  aria-hidden="true"
                />
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
