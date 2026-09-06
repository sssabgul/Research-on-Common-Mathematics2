import { ArrowLeft, ExternalLink } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CopyLinkButton } from '@/components/copy-link-button';
import { DetailFigure } from '@/components/detail-figure';
import { MathExpression } from '@/components/math-expression';
import { PrintButton } from '@/components/print-button';
import { BezierPlayground } from '@/components/bezier-playground';
import { allTopics, findTopic, topicHref } from '@/lib/curriculum-utils';
import { findTopicDetail } from '@/lib/topic-details';
import { toneStyles } from '@/lib/tone';
import 'katex/dist/katex.min.css';

type Params = { unitId: string; subunitId: string; topicId: string };
export const dynamicParams = false;
export function generateStaticParams(): Params[] {
  return allTopics.map(({ unit, subunit, topic }) => ({
    unitId: unit.id,
    subunitId: subunit.id,
    topicId: topic.id,
  }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { unitId, subunitId, topicId } = await params;
  const found = findTopic(unitId, subunitId, topicId);
  if (!found) return {};
  return {
    title: found.topic.title,
    description: found.topic.summary,
    alternates: { canonical: found.href },
    openGraph: {
      title: found.topic.title,
      description: found.topic.summary,
      url: found.href,
    },
    twitter: {
      card: 'summary',
      title: found.topic.title,
      description: found.topic.summary,
    },
  };
}
const sections = [
  ['question', '무엇을 탐구할까?'],
  ['concepts', '먼저 알아둘 개념'],
  ['example', '작은 예제로 이해하기'],
  ['activity', '직접 탐구해 보기'],
  ['reflection', '결과를 어떻게 해석할까?'],
  ['extension', '한 걸음 더'],
  ['connections', '교과·진로 연결과 참고자료'],
] as const;

export default async function TopicPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { unitId, subunitId, topicId } = await params;
  const found = findTopic(unitId, subunitId, topicId);
  if (!found) notFound();
  const detail = findTopicDetail(unitId, subunitId, topicId);
  if (!detail)
    throw new Error(
      '상세 원고 누락: ' + [unitId, subunitId, topicId].join('/'),
    );
  const { unit, subunit, topic, href } = found;
  const { example } = detail;
  return (
    <article className="detail-document mx-auto max-w-[880px]">
      <nav
        aria-label="주제 위치"
        className="mb-5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[14px] font-semibold text-[#636366] print:hidden"
      >
        <Link
          href="/"
          className="inline-flex min-h-11 items-center hover:text-[#007aff]"
        >
          주제 찾기
        </Link>
        <span aria-hidden="true">/</span>
        <Link
          href={topicHref(unitId, subunitId, topicId)}
          className="inline-flex min-h-11 items-center hover:text-[#007aff]"
        >
          {unit.title} · {subunit.label}
        </Link>
      </nav>
      <header className="mb-7">
        <p
          className={
            'mb-3 inline-block rounded-full px-3 py-1.5 text-[14px] font-bold ' +
            toneStyles[unit.tone].soft
          }
        >
          {topic.kind} · {topic.style}
        </p>
        <h1 className="text-[clamp(1.8rem,5vw,2.7rem)] leading-tight font-extrabold tracking-[-0.04em] text-[#111113]">
          {topic.title}
        </h1>
        <p className="mt-4 text-[1.05rem] leading-8 text-[#636366]">
          {topic.summary}
        </p>
        <div className="mt-5 flex flex-wrap items-start gap-2 print:hidden">
          <Link
            href={topicHref(unitId, subunitId, topicId)}
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-4 text-[14px] font-bold text-[#007aff] hover:bg-[#eef6ff]"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            소단원 목록
          </Link>
          <CopyLinkButton href={href} topicTitle={topic.title} />
          <PrintButton />
        </div>
      </header>
      {unitId === 'geometry' &&
        subunitId === 'section-point' &&
        topicId === 'bezier' && <BezierPlayground />}
      <nav
        aria-label="상세 안내 목차"
        className="mb-7 flex flex-wrap gap-2 print:hidden"
      >
        {sections.map(([id, title], i) => (
          <a
            key={id}
            href={'#' + id}
            className="inline-flex min-h-11 items-center rounded-full border border-black/[0.06] bg-white px-3 text-[14px] font-semibold text-[#636366] hover:text-[#007aff]"
          >
            {i + 1}. {title}
          </a>
        ))}
      </nav>
      <div className="detail-sections space-y-5">
        <section
          id="question"
          aria-labelledby="question-title"
          className="detail-section"
        >
          <h2 id="question-title">무엇을 탐구할까?</h2>
          <p>{detail.background}</p>
          <p className="rounded-2xl bg-[#eef6ff] p-4 font-semibold text-[#145793]">
            {topic.question}
          </p>
        </section>
        <section
          id="concepts"
          aria-labelledby="concepts-title"
          className="detail-section"
        >
          <h2 id="concepts-title">먼저 알아둘 개념</h2>
          <dl className="space-y-5">
            {detail.concepts.map((concept) => (
              <div key={concept.name}>
                <dt className="font-bold text-[#1c1c1e]">{concept.name}</dt>
                <dd className="mt-1">
                  {concept.explanation}
                  {concept.formula && (
                    <MathExpression formula={concept.formula} />
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </section>
        <section
          id="example"
          aria-labelledby="example-title"
          className="detail-section"
        >
          <h2 id="example-title">작은 예제로 이해하기</h2>
          <h3 className="font-bold text-[#1c1c1e]">{example.title}</h3>
          {example.paragraphs.map((p) => (
            <p key={p}>{p}</p>
          ))}
          {example.math?.map((formula) => (
            <MathExpression key={formula} formula={formula} />
          ))}
          {example.table && (
            <div className="detail-table overflow-x-auto">
              <table className="w-full border-collapse text-left text-base">
                <caption className="mb-2 text-left text-[14px] font-semibold text-[#636366]">
                  {example.table.caption}
                </caption>
                <thead>
                  <tr>
                    {example.table.headers.map((h) => (
                      <th
                        key={h}
                        scope="col"
                        className="border-b border-black/10 bg-[#f2f2f7] px-4 py-3 font-bold whitespace-nowrap text-[#1c1c1e]"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {example.table.rows.map((row, i) => (
                    <tr key={i}>
                      {row.map((cell, j) => (
                        <td
                          key={j}
                          className="border-b border-black/[0.06] px-4 py-3 whitespace-nowrap"
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {example.plot && <DetailFigure plot={example.plot} />}
        </section>
        <section
          id="activity"
          aria-labelledby="activity-title"
          className="detail-section"
        >
          <h2 id="activity-title">직접 탐구해 보기</h2>
          <ol className="list-none space-y-5">
            {detail.steps.map((step, i) => (
              <li
                key={step.title}
                className="detail-step flex items-start gap-3"
              >
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#e9f3ff] text-[14px] font-bold text-[#007aff]">
                  {i + 1}
                </span>
                <div className="min-w-0">
                  <h3 className="font-bold text-[#1c1c1e]">{step.title}</h3>
                  <p className="mt-1">{step.action}</p>
                  <p className="mt-2 text-[14px] text-[#636366]">
                    <span className="font-semibold">남길 결과물 · </span>
                    {step.output}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>
        <section
          id="reflection"
          aria-labelledby="reflection-title"
          className="detail-section"
        >
          <h2 id="reflection-title">결과를 어떻게 해석할까?</h2>
          <ul className="list-disc space-y-3 pl-5">
            {detail.reflection.map((q) => (
              <li key={q}>{q}</li>
            ))}
          </ul>
        </section>
        <section
          id="extension"
          aria-labelledby="extension-title"
          className="detail-section"
        >
          <h2 id="extension-title">한 걸음 더</h2>
          <ol className="list-decimal space-y-3 pl-5">
            {detail.extensions.map((q) => (
              <li key={q}>{q}</li>
            ))}
          </ol>
        </section>
        <section
          id="connections"
          aria-labelledby="connections-title"
          className="detail-section"
        >
          <h2 id="connections-title">교과·진로 연결과 참고자료</h2>
          <h3 className="font-bold text-[#1c1c1e]">교과에서 사용한 개념</h3>
          <p className="text-[14px] font-semibold text-[#636366]">
            {subunit.standard} · {topic.curriculum}
          </p>
          <p>{detail.connections.curriculum}</p>
          <h3 className="font-bold text-[#1c1c1e]">어떤 진로와 연결될까?</h3>
          <p className="text-[14px] font-semibold text-[#636366]">
            {topic.career}
          </p>
          <p>{detail.connections.career}</p>
          <h3 className="pt-3 font-bold text-[#1c1c1e]">더 읽어보기</h3>
          <ul className="list-none space-y-4">
            {detail.sources.map((source) => (
              <li key={source.url}>
                <a
                  href={source.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-11 items-center gap-2 font-semibold text-[#0066cc] underline decoration-[#007aff]/30 underline-offset-4"
                >
                  {source.title}
                  <ExternalLink
                    className="size-4 shrink-0"
                    aria-hidden="true"
                  />
                  <span className="sr-only"> (새 창)</span>
                </a>
                <p className="text-[14px] leading-6 text-[#636366]">
                  {source.note}
                </p>
              </li>
            ))}
          </ul>
        </section>
      </div>
      <Link
        href={topicHref(unitId, subunitId, topicId)}
        className="mt-7 inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-5 text-base font-bold text-[#007aff] print:hidden"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        {subunit.label} 주제로 돌아가기
      </Link>
    </article>
  );
}
