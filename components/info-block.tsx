import type { LucideIcon } from 'lucide-react';

/** 주제 카드 안의 네 갈래(탐구 질문·방향·진로·교과) 색상. 대단원 색조와는 별개다. */
type InfoTone = 'yellow' | 'blue' | 'purple' | 'green';

const INFO_TONES: Record<InfoTone, string> = {
  yellow: 'bg-[#fff8df] text-[#8a5a00]',
  blue: 'bg-[#edf6ff] text-[#075eaa]',
  purple: 'bg-[#f6efff] text-[#6941a5]',
  green: 'bg-[#eef8f0] text-[#28733a]',
};

export function InfoBlock({
  icon: Icon,
  title,
  text,
  tone,
}: {
  icon: LucideIcon;
  title: string;
  text: string;
  tone: InfoTone;
}) {
  return (
    <div className="rounded-[1.15rem] bg-[#f7f7fa] p-4 sm:p-[18px]">
      <div className="mb-2 flex items-center gap-2">
        <span
          className={`flex size-8 items-center justify-center rounded-full ${INFO_TONES[tone]}`}
        >
          <Icon className="size-4" aria-hidden="true" />
        </span>
        <h4 className="text-[15px] font-bold text-[#3a3a3c]">{title}</h4>
      </div>
      <p className="text-[15px] leading-6 text-[#55555a] sm:text-base sm:leading-7">
        {text}
      </p>
    </div>
  );
}
