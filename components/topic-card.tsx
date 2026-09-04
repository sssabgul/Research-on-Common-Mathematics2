import { BookOpenText, GraduationCap, Lightbulb, Route } from 'lucide-react';

import { CopyLinkButton } from '@/components/copy-link-button';
import { InfoBlock } from '@/components/info-block';
import { Badge } from '@/components/ui/badge';
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
  /** 이 주제의 공유 링크. 예: `/geometry/circle#geofence` */
  href: string;
}) {
  return (
    <article
      id={topic.id}
      // 앵커로 도착했을 때 sticky 헤더에 제목이 가리지 않도록 여유를 준다.
      className="scroll-mt-24 rounded-[1.6rem] border border-black/[0.06] bg-white p-5 shadow-[0_1px_2px_rgb(0_0_0/3%),0_12px_32px_rgb(28_53_84/6%)] sm:p-7"
    >
      <div className="flex items-start gap-4">
        <span
          className={`flex size-10 shrink-0 items-center justify-center rounded-full text-[15px] font-bold ${toneStyles[tone].cardNumber}`}
        >
          {number}
        </span>
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <Badge className="h-7 bg-[#f2f2f7] px-3 text-[13px] text-[#3a3a3c]">
              {topic.level}
            </Badge>
            <Badge className="h-7 bg-[#eef7ef] px-3 text-[13px] text-[#28733a]">
              {topic.style}
            </Badge>
            <CopyLinkButton
              className="ml-auto print:hidden"
              href={href}
              topicId={topic.id}
              topicTitle={topic.title}
            />
          </div>
          <h3 className="text-[1.2rem] leading-snug font-bold tracking-[-0.02em] text-[#1c1c1e] sm:text-[1.35rem]">
            {topic.title}
          </h3>
          <p className="mt-2 text-[1rem] leading-7 text-[#636366]">
            {topic.summary}
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <InfoBlock
          icon={Lightbulb}
          title="탐구 질문"
          text={topic.question}
          tone="yellow"
        />
        <InfoBlock
          icon={Route}
          title="탐구 방향"
          text={topic.method}
          tone="blue"
        />
        <InfoBlock
          icon={GraduationCap}
          title="진로 연계"
          text={topic.career}
          tone="purple"
        />
        <InfoBlock
          icon={BookOpenText}
          title="교과 연계"
          text={topic.curriculum}
          tone="green"
        />
      </div>
    </article>
  );
}
