import { ChevronRight, ExternalLink, Sparkles } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';

import { TopicSearch } from '@/components/topic-search';
import { UnitIcon } from '@/components/unit-icon';
import { curriculumUnits } from '@/lib/curriculum';
import {
  subunitCount,
  subunitHref,
  totalTopicCount,
  unitCount,
} from '@/lib/curriculum-utils';
import { toneStyles } from '@/lib/tone';

export const metadata: Metadata = {
  alternates: { canonical: '/' },
};

// 화면에 보이는 수치는 전부 데이터에서 파생한다.
const stats = [
  [unitCount, '대단원'],
  [subunitCount, '소단원'],
  [totalTopicCount, '탐구 주제'],
] as const;

const sources = [
  [
    '교육부 고시',
    'https://www.moe.go.kr/boardCnts/viewRenew.do?boardID=141&boardSeq=93458&lev=0&searchType=null&status=',
  ],
  [
    '경기도교육청 안내서',
    'https://www.goe.go.kr/resource/old/BBSMSTR_000000030136/BBS_202404250409254370.pdf',
  ],
  [
    '교육과정 표준체계',
    'https://cdn.kosac.re.kr/files/cms/attach/202501/253c33f280c14c3999b08364681fb62c_1736733732226.pdf',
  ],
];

export default function Home() {
  return (
    <>
      <section className="mb-8 sm:mb-10">
        <p className="mb-3 flex items-center gap-2 text-[15px] font-bold text-[#007aff]">
          <Sparkles className="size-[18px]" aria-hidden="true" />
          생기부로 이어지는 나만의 수학 탐구
        </p>
        <h1 className="max-w-3xl text-[clamp(2rem,6vw,4rem)] leading-[1.08] font-extrabold tracking-[-0.055em] text-[#111113]">
          탐구 주제를 찾아보세요.
        </h1>
        <p className="mt-5 max-w-2xl text-[1.05rem] leading-8 text-[#636366] sm:text-[1.15rem]">
          단원별 탐구 주제를 찾아보세요.
        </p>
        <ul
          className="mt-6 flex list-none flex-wrap gap-2.5"
          aria-label="사이트 수록 내용"
        >
          {stats.map(([number, label]) => (
            <li
              key={label}
              className="rounded-full border border-black/[0.05] bg-white px-4 py-2 text-[14px] text-[#636366] shadow-sm"
            >
              <strong className="mr-1 font-bold text-[#1c1c1e]">
                {number}
              </strong>
              {label}
            </li>
          ))}
        </ul>
      </section>

      <TopicSearch />

      <div className="mt-10 space-y-10">
        {curriculumUnits.map((unit) => (
          <section key={unit.id} aria-labelledby={`unit-${unit.id}`}>
            <div
              className={`flex items-start gap-3 rounded-[1.15rem] p-4 ${toneStyles[unit.tone].soft}`}
            >
              <UnitIcon id={unit.id} className="mt-0.5 size-5 shrink-0" />
              <div>
                <h2
                  id={`unit-${unit.id}`}
                  className="text-[1.15rem] font-bold tracking-[-0.02em]"
                >
                  {unit.roman}. {unit.title}
                </h2>
                <p className="mt-1 text-[15px] leading-6 font-medium">
                  {unit.description}
                </p>
              </div>
            </div>

            <ul className="mt-3 grid list-none gap-3 sm:grid-cols-2">
              {unit.subunits.map((subunit, index) => (
                <li key={subunit.id}>
                  <Link
                    href={subunitHref(unit.id, subunit.id)}
                    className="flex h-full items-start gap-3 rounded-[1.35rem] border border-black/[0.06] bg-white p-5 shadow-[0_1px_2px_rgb(0_0_0/3%)] transition-colors hover:bg-[#f7f9fc] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#007aff]"
                  >
                    <span
                      className={`flex size-9 shrink-0 items-center justify-center rounded-full text-[14px] font-bold ${toneStyles[unit.tone].cardNumber}`}
                    >
                      {index + 1}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[1.05rem] leading-snug font-bold text-[#1c1c1e]">
                        {subunit.label}
                      </span>
                      <span className="mt-1 block text-[13px] font-semibold text-[#8e8e93]">
                        {subunit.standard} · 주제 {subunit.topics.length}개
                      </span>
                      <span className="mt-2 block text-[15px] leading-6 text-[#636366]">
                        {subunit.intro}
                      </span>
                    </span>
                    <ChevronRight
                      className="mt-1 size-5 shrink-0 text-[#c7c7cc]"
                      aria-hidden="true"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <section
        className="mt-10 rounded-[1.4rem] border border-black/[0.06] bg-white p-5 sm:p-7"
        aria-labelledby="sources-title"
      >
        <p className="text-[13px] font-bold tracking-[0.08em] text-[#8e8e93] uppercase">
          Curriculum sources
        </p>
        <h2 id="sources-title" className="mt-1 text-[1.2rem] font-bold">
          교육과정 기준 자료
        </h2>
        <p className="mt-2 text-[15px] leading-6 text-[#636366]">
          단원 구조와 성취기준 코드는 2022 개정 교육과정의 공식·공공 자료를
          기준으로 정리했습니다.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {sources.map(([label, url]) => (
            <a
              key={url}
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#f2f2f7] px-4 py-2 text-[14px] font-bold text-[#3a3a3c] hover:bg-[#e8e8ed] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#007aff]"
              href={url}
              target="_blank"
              rel="noreferrer"
            >
              {label} <ExternalLink className="size-4" aria-hidden="true" />
            </a>
          ))}
        </div>
      </section>
    </>
  );
}
