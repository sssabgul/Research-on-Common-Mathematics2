import { CheckCircle2, Compass, Target } from 'lucide-react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { PrintButton } from '@/components/print-button';
import { SubunitNav } from '@/components/subunit-nav';
import { TopicCard } from '@/components/topic-card';
import { Badge } from '@/components/ui/badge';
import { UnitIcon } from '@/components/unit-icon';
import { UnitNav } from '@/components/unit-nav';
import {
  allSubunits,
  findSubunit,
  subunitHref,
  topicHref,
} from '@/lib/curriculum-utils';
import { toneStyles } from '@/lib/tone';

// 데이터에 있는 8개 조합만 존재한다. 그 밖의 경로는 404.
export const dynamicParams = false;

type Params = { unitId: string; subunitId: string };

export function generateStaticParams(): Params[] {
  return allSubunits.map(({ unit, subunit }) => ({
    unitId: unit.id,
    subunitId: subunit.id,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { unitId, subunitId } = await params;
  const found = findSubunit(unitId, subunitId);
  if (!found) return {};

  const { unit, subunit } = found;
  const title = `${subunit.label} 탐구 주제 ${subunit.topics.length}개`;
  const url = subunitHref(unit.id, subunit.id);

  return {
    title,
    description: subunit.intro,
    alternates: { canonical: url },
    openGraph: { title, description: subunit.intro, url },
  };
}

export default async function SubunitPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { unitId, subunitId } = await params;
  const found = findSubunit(unitId, subunitId);
  if (!found) notFound();

  const { unit, subunit } = found;
  const styles = toneStyles[unit.tone];

  return (
    <>
      <UnitNav activeUnitId={unit.id} />

      <div
        className={`mt-4 flex items-start gap-3 rounded-[1.15rem] p-4 ${styles.soft} print:hidden`}
      >
        <UnitIcon id={unit.id} className="mt-0.5 size-5 shrink-0" />
        <p className="text-[15px] leading-6 font-medium">{unit.description}</p>
      </div>

      <div className="mt-7 grid items-start gap-7 md:grid-cols-[310px_minmax(0,1fr)] lg:gap-10">
        <aside className="md:sticky md:top-[96px] print:hidden">
          <div className="mb-3 flex items-end justify-between px-1">
            <div>
              <p className="text-[13px] font-bold tracking-[0.08em] text-[#8e8e93] uppercase">
                {unit.roman}. {unit.title}
              </p>
              <h2 className="mt-1 text-[1.35rem] font-bold tracking-[-0.025em]">
                소단원을 골라보세요
              </h2>
            </div>
            <span className="text-[14px] font-semibold text-[#8e8e93]">
              {unit.subunits.length}개
            </span>
          </div>

          <SubunitNav unit={unit} activeSubunitId={subunit.id} />

          <div className="mt-4 rounded-[1.2rem] bg-[#fff9e9] p-4 text-[14px] leading-6 text-[#6d5311]">
            <strong className="font-bold">기록이 좋아지는 한 끗</strong>
            <p className="mt-1">
              주제를 그대로 조사하기보다 나만의 자료, 계산과 한계 분석을 꼭
              더해보세요.
            </p>
          </div>
        </aside>

        <section aria-labelledby="subunit-title">
          <div
            className={`mb-5 rounded-[1.6rem] bg-gradient-to-br ${styles.gradient} p-6 text-white shadow-[0_18px_44px_rgb(28_53_84/16%)] sm:p-8`}
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <span className="flex size-12 items-center justify-center rounded-[16px] bg-white/18 backdrop-blur-sm">
                <Compass className="size-6" aria-hidden="true" />
              </span>
              <Badge className="h-auto min-h-8 border border-white/25 bg-white/16 px-3 py-1 text-right text-[13px] leading-5 whitespace-normal text-white">
                공식 내용 요소 · {subunit.official}
              </Badge>
            </div>
            <p className="text-[14px] font-bold text-white/75">
              {subunit.standard}
            </p>
            <h1
              id="subunit-title"
              className="mt-1 text-[1.8rem] font-extrabold tracking-[-0.035em] sm:text-[2.25rem]"
            >
              {subunit.label}
            </h1>
            <p className="mt-3 max-w-2xl text-[1rem] leading-7 text-white/90 sm:text-[1.08rem]">
              {subunit.intro}
            </p>
            <div className="mt-5 flex items-center gap-2 text-[14px] font-bold text-white/85">
              <Target className="size-[18px]" aria-hidden="true" />
              탐구 주제 {subunit.topics.length}개
            </div>
          </div>

          {subunit.note && (
            <div className="mb-5 flex gap-3 rounded-[1.2rem] border border-[#ffe49b] bg-[#fff9e9] p-4 text-[14px] leading-6 text-[#6d5311]">
              <CheckCircle2
                className="mt-0.5 size-[18px] shrink-0"
                aria-hidden="true"
              />
              <p>{subunit.note}</p>
            </div>
          )}

          <div className="mb-4 flex justify-end">
            <PrintButton />
          </div>

          <div className="space-y-4">
            {subunit.topics.map((topic, index) => (
              <TopicCard
                key={topic.id}
                topic={topic}
                number={index + 1}
                tone={unit.tone}
                href={topicHref(unit.id, subunit.id, topic.id)}
              />
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
