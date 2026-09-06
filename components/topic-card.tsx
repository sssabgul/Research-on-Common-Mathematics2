import { ArrowUpRight, GraduationCap } from 'lucide-react';
import Link from 'next/link';
import type { Tone, Topic } from '@/lib/curriculum';
import { toneStyles } from '@/lib/tone';

export function TopicCard({
  topic,
  number,
  tone,
  href,
}: {
  topic: Topic;
  number: number;
  tone: Tone;
  href: string;
}) {
  return (
    <article
      id={topic.id}
      className="topic-summary scroll-mt-24 rounded-[1.6rem] border border-black/[0.06] bg-white p-5 shadow-[0_4px_24px_rgb(28_53_84/5%)] sm:p-7"
    >
      <div className="flex items-start gap-3">
        <span
          className={`flex size-10 shrink-0 items-center justify-center rounded-full text-[15px] font-bold ${toneStyles[tone].cardNumber}`}
        >
          {number}
        </span>
        <div className="min-w-0 flex-1">
          <p className="mb-2 text-[14px] font-semibold text-[#636366]">
            {topic.kind} · {topic.style}
          </p>
          <h3 className="text-[1.2rem] leading-snug font-bold tracking-[-0.02em] text-[#1c1c1e] sm:text-[1.35rem]">
            {topic.title}
          </h3>
          <p className="mt-2 text-base leading-7 text-[#636366]">
            {topic.summary}
          </p>
        </div>
      </div>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-black/[0.06] pt-4">
        <p className="flex min-w-0 flex-1 items-start gap-2 text-[14px] leading-6 text-[#636366]">
          <GraduationCap
            className="mt-0.5 size-5 shrink-0"
            aria-hidden="true"
          />
          {topic.career}
        </p>
        <Link
          href={href}
          aria-label={`${topic.title} 자세히`}
          className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full bg-[#007aff] px-5 text-base font-bold text-white hover:bg-[#0066cc] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#007aff]"
        >
          자세히
          <ArrowUpRight className="size-4" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
