import Link from 'next/link';

import { UnitIcon } from '@/components/unit-icon';
import { curriculumUnits, type UnitId } from '@/lib/curriculum';
import { subunitHref } from '@/lib/curriculum-utils';

/**
 * 대단원 전환. 예전에는 버튼 + aria-pressed였지만 이제 실제 페이지 이동이라
 * 링크가 맞다. 각 대단원의 첫 소단원으로 보낸다.
 */
export function UnitNav({ activeUnitId }: { activeUnitId?: UnitId }) {
  return (
    <nav
      aria-label="대단원"
      className="overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      <ul className="flex min-w-full list-none justify-start gap-1.5 rounded-[1.25rem] bg-[#e5e5ea]/75 p-1.5 sm:w-full">
        {curriculumUnits.map((unit) => {
          const active = unit.id === activeUnitId;
          return (
            <li key={unit.id} className="min-w-[104px] flex-1">
              <Link
                href={subunitHref(unit.id, unit.subunits[0].id)}
                // 정확히 이 페이지는 아니고 '이 묶음 안에서 현재'라 'true'를 쓴다.
                aria-current={active ? 'true' : undefined}
                className={`flex h-[58px] w-full items-center justify-center gap-1.5 rounded-[0.95rem] px-3 text-[15px] font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#007aff] sm:h-[64px] sm:text-[16px] ${
                  active
                    ? 'bg-white text-[#1c1c1e] shadow-[0_2px_8px_rgb(0_0_0/8%)]'
                    : 'text-[#636366] hover:bg-white/45 hover:text-[#1c1c1e]'
                }`}
              >
                <UnitIcon id={unit.id} className="size-5 shrink-0" />
                <span className="sm:hidden">{unit.shortTitle}</span>
                <span className="hidden sm:inline">
                  {unit.roman}. {unit.title}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
