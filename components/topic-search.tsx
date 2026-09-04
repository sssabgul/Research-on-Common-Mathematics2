'use client';

import { Search, X } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';

import {
  LEVELS,
  TOPIC_KINDS,
  type Level,
  type TopicKind,
} from '@/lib/curriculum';
import { searchTopics, totalTopicCount } from '@/lib/curriculum-utils';

function toggle<T>(list: T[], value: T): T[] {
  return list.includes(value)
    ? list.filter((item) => item !== value)
    : [...list, value];
}

const chipBase =
  'inline-flex min-h-9 items-center rounded-full px-3.5 text-[14px] font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#007aff]';
const chipOn = 'bg-[#007aff] text-white';
const chipOff =
  'bg-white text-[#636366] hover:bg-[#eef6ff] hover:text-[#0066cc]';

export function TopicSearch() {
  const [query, setQuery] = useState('');
  const [levels, setLevels] = useState<Level[]>([]);
  const [kinds, setKinds] = useState<TopicKind[]>([]);

  const results = useMemo(
    () => searchTopics({ query, levels, kinds }),
    [query, levels, kinds],
  );

  const active = query.trim() !== '' || levels.length > 0 || kinds.length > 0;

  const reset = () => {
    setQuery('');
    setLevels([]);
    setKinds([]);
  };

  return (
    <section
      id="search"
      aria-labelledby="search-title"
      className="scroll-mt-24 rounded-[1.6rem] border border-black/[0.06] bg-white p-5 shadow-[0_8px_28px_rgb(28_53_84/5%)] sm:p-7 print:hidden"
    >
      <h2
        id="search-title"
        className="text-[1.2rem] font-bold tracking-[-0.025em]"
      >
        주제 {totalTopicCount}개에서 찾기
      </h2>
      <p className="mt-1 text-[15px] leading-6 text-[#636366]">
        관심 있는 낱말이나 진로를 넣어보세요. 난이도와 유형으로 좁힐 수도
        있습니다.
      </p>

      <div className="mt-4 flex items-center gap-2 rounded-[1.1rem] bg-[#f2f2f7] px-4 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-[#007aff]">
        <Search className="size-5 shrink-0 text-[#8e8e93]" aria-hidden="true" />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="예: 게임, 물류, 증명, 렌즈"
          aria-label="탐구 주제 검색"
          className="min-h-12 w-full bg-transparent text-[16px] text-[#1c1c1e] outline-none placeholder:text-[#a1a1a6]"
        />
      </div>

      <fieldset className="mt-4">
        <legend className="mb-2 text-[13px] font-bold text-[#8e8e93]">
          난이도
        </legend>
        <div className="flex flex-wrap gap-2">
          {LEVELS.map((level) => {
            const on = levels.includes(level);
            return (
              <button
                key={level}
                type="button"
                aria-pressed={on}
                onClick={() => setLevels(toggle(levels, level))}
                className={`${chipBase} ${on ? chipOn : chipOff}`}
              >
                {level}
              </button>
            );
          })}
        </div>
      </fieldset>

      <fieldset className="mt-4">
        <legend className="mb-2 text-[13px] font-bold text-[#8e8e93]">
          탐구 유형
        </legend>
        <div className="flex flex-wrap gap-2">
          {TOPIC_KINDS.map((kind) => {
            const on = kinds.includes(kind);
            return (
              <button
                key={kind}
                type="button"
                aria-pressed={on}
                onClick={() => setKinds(toggle(kinds, kind))}
                className={`${chipBase} ${on ? chipOn : chipOff}`}
              >
                {kind}
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className="mt-5 flex items-center justify-between gap-3 border-t border-black/[0.06] pt-4">
        {/* 결과 개수만 낭독한다. 예전처럼 결과 전체를 live 영역에 두면
            바뀔 때마다 카드 수십 장이 통째로 읽힌다. */}
        <p
          aria-live="polite"
          className="text-[15px] font-semibold text-[#3a3a3c]"
        >
          {active
            ? `조건에 맞는 주제 ${results.length}개`
            : '검색어를 넣거나 조건을 골라보세요.'}
        </p>
        {active && (
          <button
            type="button"
            onClick={reset}
            className="inline-flex min-h-9 shrink-0 items-center gap-1 rounded-full px-3 text-[14px] font-bold text-[#636366] hover:bg-[#f2f2f7] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#007aff]"
          >
            <X className="size-4" aria-hidden="true" />
            초기화
          </button>
        )}
      </div>

      {active && results.length > 0 && (
        <ul className="mt-3 grid list-none gap-2">
          {results.map(({ unit, subunit, topic, href }) => (
            <li key={href}>
              <Link
                href={href}
                className="block rounded-[1.1rem] border border-black/[0.06] p-4 transition-colors hover:bg-[#f7f9fc] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#007aff]"
              >
                <p className="text-[13px] font-bold text-[#8e8e93]">
                  {unit.roman}. {unit.title} · {subunit.label}
                </p>
                <p className="mt-1 text-[1.05rem] leading-snug font-bold text-[#1c1c1e]">
                  {topic.title}
                </p>
                <p className="mt-1 line-clamp-2 text-[15px] leading-6 text-[#636366]">
                  {topic.summary}
                </p>
                <p className="mt-2 text-[13px] font-semibold text-[#8e8e93]">
                  {topic.level} · {topic.kind}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {active && results.length === 0 && (
        <p className="mt-3 rounded-[1.1rem] bg-[#f7f7fa] p-5 text-[15px] leading-6 text-[#636366]">
          조건에 맞는 주제가 없습니다. 낱말을 줄이거나 필터를 하나씩 꺼보세요.
        </p>
      )}
    </section>
  );
}
