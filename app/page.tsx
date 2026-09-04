'use client';

import {
  ArrowUp,
  Binary,
  BookOpenText,
  ChartNoAxesCombined,
  CheckCircle2,
  ChevronRight,
  Compass,
  ExternalLink,
  GraduationCap,
  Lightbulb,
  Route,
  Shapes,
  Sparkles,
  Target,
} from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  curriculumUnits,
  totalTopicCount,
  type CurriculumUnit,
  type Topic,
} from '@/lib/curriculum';

const toneStyles = {
  blue: {
    gradient: 'from-[#0068d7] to-[#2188df]',
    soft: 'bg-[#eaf4ff] text-[#0066cc]',
    active: 'bg-[#eef6ff] text-[#0066cc] hover:bg-[#e6f1ff]',
    number: 'bg-[#007aff] text-white',
  },
  purple: {
    gradient: 'from-[#5940b8] to-[#8453cb]',
    soft: 'bg-[#f2edff] text-[#6742c2]',
    active: 'bg-[#f4efff] text-[#6742c2] hover:bg-[#eee7ff]',
    number: 'bg-[#7657e8] text-white',
  },
  orange: {
    gradient: 'from-[#b84a00] to-[#e87500]',
    soft: 'bg-[#fff2df] text-[#a95000]',
    active: 'bg-[#fff4e6] text-[#a95000] hover:bg-[#ffeed8]',
    number: 'bg-[#f27d16] text-white',
  },
};

function UnitIcon({ id, className }: { id: string; className?: string }) {
  if (id === 'logic') return <Binary className={className} aria-hidden="true" />;
  if (id === 'functions') {
    return <ChartNoAxesCombined className={className} aria-hidden="true" />;
  }
  return <Shapes className={className} aria-hidden="true" />;
}

function InfoBlock({
  icon: Icon,
  title,
  text,
  tone,
}: {
  icon: typeof Lightbulb;
  title: string;
  text: string;
  tone: 'yellow' | 'blue' | 'purple' | 'green';
}) {
  const tones = {
    yellow: 'bg-[#fff8df] text-[#8a5a00]',
    blue: 'bg-[#edf6ff] text-[#075eaa]',
    purple: 'bg-[#f6efff] text-[#6941a5]',
    green: 'bg-[#eef8f0] text-[#28733a]',
  };

  return (
    <div className="rounded-[1.15rem] bg-[#f7f7fa] p-4 sm:p-[18px]">
      <div className="mb-2 flex items-center gap-2">
        <span className={`flex size-8 items-center justify-center rounded-full ${tones[tone]}`}>
          <Icon className="size-4" aria-hidden="true" />
        </span>
        <h4 className="text-[15px] font-bold text-[#3a3a3c]">{title}</h4>
      </div>
      <p className="text-[15px] leading-6 text-[#55555a] sm:text-base sm:leading-7">{text}</p>
    </div>
  );
}

function TopicCard({ topic, number, tone }: { topic: Topic; number: number; tone: CurriculumUnit['tone'] }) {
  const numberStyle = {
    blue: 'bg-[#e8f2ff] text-[#007aff]',
    purple: 'bg-[#f2edff] text-[#7657e8]',
    orange: 'bg-[#fff1de] text-[#d86500]',
  }[tone];

  return (
    <article className="rounded-[1.6rem] border border-black/[0.06] bg-white p-5 shadow-[0_1px_2px_rgb(0_0_0/3%),0_12px_32px_rgb(28_53_84/6%)] sm:p-7">
      <div className="flex items-start gap-4">
        <span className={`flex size-10 shrink-0 items-center justify-center rounded-full text-[15px] font-bold ${numberStyle}`}>
          {number}
        </span>
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap gap-2">
            <Badge className="h-7 bg-[#f2f2f7] px-3 text-[13px] text-[#3a3a3c]">
              {topic.level}
            </Badge>
            <Badge className="h-7 bg-[#eef7ef] px-3 text-[13px] text-[#28733a]">
              {topic.style}
            </Badge>
          </div>
          <h3 className="text-[1.2rem] font-bold leading-snug tracking-[-0.02em] text-[#1c1c1e] sm:text-[1.35rem]">
            {topic.title}
          </h3>
          <p className="mt-2 text-[1rem] leading-7 text-[#636366]">{topic.summary}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <InfoBlock icon={Lightbulb} title="탐구 질문" text={topic.question} tone="yellow" />
        <InfoBlock icon={Route} title="탐구 방향" text={topic.method} tone="blue" />
        <InfoBlock icon={GraduationCap} title="진로 연계" text={topic.career} tone="purple" />
        <InfoBlock icon={BookOpenText} title="교과 연계" text={topic.curriculum} tone="green" />
      </div>
    </article>
  );
}

function UnitExplorer({
  unit,
  selectedSubunitId,
  onSelectSubunit,
}: {
  unit: CurriculumUnit;
  selectedSubunitId: string;
  onSelectSubunit: (id: string) => void;
}) {
  const selected =
    unit.subunits.find((subunit) => subunit.id === selectedSubunitId) ?? unit.subunits[0];
  const styles = toneStyles[unit.tone];

  const selectSubunit = (id: string) => {
    onSelectSubunit(id);
    window.requestAnimationFrame(() => {
      if (window.innerWidth < 768) {
        document.querySelector('#topic-results')?.scrollIntoView({ behavior: 'smooth' });
      }
    });
  };

  return (
    <div className="mt-7 grid items-start gap-7 md:grid-cols-[310px_minmax(0,1fr)] lg:gap-10">
      <aside className="md:sticky md:top-[96px]" aria-label={`${unit.title} 소단원 선택`}>
        <div className="mb-3 flex items-end justify-between px-1">
          <div>
            <p className="text-[13px] font-bold uppercase tracking-[0.08em] text-[#8e8e93]">
              {unit.roman}. {unit.title}
            </p>
            <h2 className="mt-1 text-[1.35rem] font-bold tracking-[-0.025em]">소단원을 골라보세요</h2>
          </div>
          <span className="text-[14px] font-semibold text-[#8e8e93]">{unit.subunits.length}개</span>
        </div>

        <nav className="overflow-hidden rounded-[1.35rem] border border-black/[0.05] bg-white shadow-[0_8px_28px_rgb(28_53_84/5%)]">
          {unit.subunits.map((subunit, index) => {
            const active = subunit.id === selected.id;
            return (
              <Button
                key={subunit.id}
                type="button"
                variant="ghost"
                onClick={() => selectSubunit(subunit.id)}
                aria-current={active ? 'page' : undefined}
                className={`relative h-auto min-h-[76px] w-full justify-start rounded-none px-4 py-3.5 text-left text-[16px] transition-colors hover:bg-[#f5f8fc] focus-visible:z-10 ${
                  index !== unit.subunits.length - 1 ? 'border-b border-black/[0.06]' : ''
                } ${active ? styles.active : 'bg-white text-[#1c1c1e]'}`}
              >
                <span className={`mr-3 flex size-9 shrink-0 items-center justify-center rounded-full text-[14px] font-bold ${active ? styles.number : 'bg-[#f2f2f7] text-[#636366]'}`}>
                  {index + 1}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block whitespace-normal font-bold leading-5">{subunit.label}</span>
                  <span className={`mt-1 block text-[13px] font-medium ${active ? 'opacity-75' : 'text-[#8e8e93]'}`}>
                    주제 {subunit.topics.length}개
                  </span>
                </span>
                <ChevronRight className={`ml-2 size-5 shrink-0 ${active ? 'opacity-80' : 'text-[#c7c7cc]'}`} aria-hidden="true" />
              </Button>
            );
          })}
        </nav>

        <div className="mt-4 rounded-[1.2rem] bg-[#fff9e9] p-4 text-[14px] leading-6 text-[#6d5311]">
          <strong className="font-bold">기록이 좋아지는 한 끗</strong>
          <p className="mt-1">주제를 그대로 조사하기보다 나만의 자료, 계산과 한계 분석을 꼭 더해보세요.</p>
        </div>
      </aside>

      <section id="topic-results" aria-live="polite" className="scroll-mt-24">
        <div className={`mb-5 rounded-[1.6rem] bg-gradient-to-br ${styles.gradient} p-6 text-white shadow-[0_18px_44px_rgb(28_53_84/16%)] sm:p-8`}>
          <div className="mb-5 flex items-start justify-between gap-4">
            <span className="flex size-12 items-center justify-center rounded-[16px] bg-white/18 backdrop-blur-sm">
              <Compass className="size-6" aria-hidden="true" />
            </span>
            <Badge className="h-auto min-h-8 whitespace-normal border border-white/25 bg-white/16 px-3 py-1 text-right text-[13px] leading-5 text-white">
              공식 내용 요소 · {selected.official}
            </Badge>
          </div>
          <p className="text-[14px] font-bold text-white/75">{selected.standard}</p>
          <h2 className="mt-1 text-[1.8rem] font-extrabold tracking-[-0.035em] sm:text-[2.25rem]">{selected.label}</h2>
          <p className="mt-3 max-w-2xl text-[1rem] leading-7 text-white/90 sm:text-[1.08rem]">{selected.intro}</p>
          <div className="mt-5 flex items-center gap-2 text-[14px] font-bold text-white/85">
            <Target className="size-[18px]" aria-hidden="true" />
            탐구 주제 {selected.topics.length}개
          </div>
        </div>

        {selected.note && (
          <div className="mb-5 flex gap-3 rounded-[1.2rem] border border-[#ffe49b] bg-[#fff9e9] p-4 text-[14px] leading-6 text-[#6d5311]">
            <CheckCircle2 className="mt-0.5 size-[18px] shrink-0" aria-hidden="true" />
            <p>{selected.note}</p>
          </div>
        )}

        <div className="space-y-4">
          {selected.topics.map((topic, index) => (
            <TopicCard key={topic.title} topic={topic} number={index + 1} tone={unit.tone} />
          ))}
        </div>
      </section>
    </div>
  );
}

export default function Home() {
  const [selectedUnitId, setSelectedUnitId] = useState(curriculumUnits[0].id);
  const [selectedSubunitId, setSelectedSubunitId] = useState(curriculumUnits[0].subunits[0].id);
  const selectedUnit =
    curriculumUnits.find((unit) => unit.id === selectedUnitId) ?? curriculumUnits[0];

  const selectUnit = (unitId: string) => {
    const nextUnit = curriculumUnits.find((unit) => unit.id === unitId);
    setSelectedUnitId(unitId);
    if (nextUnit) setSelectedSubunitId(nextUnit.subunits[0].id);
  };

  return (
    <div className="min-h-screen bg-[#f2f2f7] text-[#1c1c1e]">
      <header className="sticky top-0 z-40 border-b border-black/[0.06] bg-white/80 backdrop-blur-2xl supports-[backdrop-filter]:bg-white/72">
        <div className="safe-area-x mx-auto flex h-[64px] max-w-[1180px] items-center justify-between sm:h-[72px]">
          <a href="#top" className="flex min-w-0 items-center gap-3 rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#007aff]">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-[13px] bg-[#007aff] text-white shadow-[0_4px_14px_rgb(0_122_255/24%)]">
              <Shapes className="size-5" aria-hidden="true" />
            </span>
            <span className="truncate text-[17px] font-bold tracking-[-0.02em]">공통수학2 탐구실</span>
          </a>
          <span className="hidden items-center gap-1.5 rounded-full bg-[#e8f2ff] px-3 py-1.5 text-[13px] font-semibold text-[#0066cc] sm:flex">
            <CheckCircle2 className="size-4" aria-hidden="true" />
            2022 개정 교육과정
          </span>
        </div>
      </header>

      <main id="top" className="safe-area-x mx-auto max-w-[1180px] pb-20 pt-10 sm:pt-14">
        <section className="mb-8 sm:mb-10">
          <p className="mb-3 flex items-center gap-2 text-[15px] font-bold text-[#007aff]">
            <Sparkles className="size-[18px]" aria-hidden="true" />
            생기부로 이어지는 나만의 수학 탐구
          </p>
          <h1 className="max-w-3xl text-[clamp(2rem,6vw,4rem)] font-extrabold leading-[1.08] tracking-[-0.055em] text-[#111113]">
            작은 궁금증에서<br />탐구 주제를 찾아보세요.
          </h1>
          <p className="mt-5 max-w-2xl text-[1.05rem] leading-8 text-[#636366] sm:text-[1.15rem]">
            대단원과 소단원을 고르면 고1 수준에서 직접 계산하고 관찰할 수 있는 주제와
            탐구 방향, 진로·교과 연계를 함께 볼 수 있어요.
          </p>
          <div className="mt-6 flex flex-wrap gap-2.5" aria-label="사이트 수록 내용">
            {[
              ['3', '대단원'],
              ['8', '소단원'],
              [String(totalTopicCount), '탐구 주제'],
            ].map(([number, label]) => (
              <span key={label} className="rounded-full border border-black/[0.05] bg-white px-4 py-2 text-[14px] text-[#636366] shadow-sm">
                <strong className="mr-1 font-bold text-[#1c1c1e]">{number}</strong>
                {label}
              </span>
            ))}
          </div>
        </section>

        <div className="overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div
            role="group"
            aria-label="대단원 선택"
            className="flex min-w-full justify-start gap-1.5 rounded-[1.25rem] bg-[#e5e5ea]/75 p-1.5 sm:w-full"
          >
            {curriculumUnits.map((unit) => {
              const active = unit.id === selectedUnit.id;
              return (
                <Button
                  key={unit.id}
                  type="button"
                  variant="ghost"
                  aria-pressed={active}
                  onClick={() => selectUnit(unit.id)}
                  className={`h-[58px] min-w-[104px] flex-1 rounded-[0.95rem] px-3 text-[15px] font-bold sm:h-[64px] sm:text-[16px] ${
                    active
                      ? 'bg-white text-[#1c1c1e] shadow-[0_2px_8px_rgb(0_0_0/8%)] hover:bg-white'
                      : 'text-[#636366] hover:bg-white/45 hover:text-[#1c1c1e]'
                  }`}
                >
                  <UnitIcon id={unit.id} className="size-5" />
                  <span className="sm:hidden">{unit.shortTitle}</span>
                  <span className="hidden sm:inline">{unit.roman}. {unit.title}</span>
                </Button>
              );
            })}
          </div>
        </div>

        <div className={`mt-4 flex items-start gap-3 rounded-[1.15rem] p-4 ${toneStyles[selectedUnit.tone].soft}`}>
          <UnitIcon id={selectedUnit.id} className="mt-0.5 size-5 shrink-0" />
          <p className="text-[15px] font-medium leading-6">{selectedUnit.description}</p>
        </div>
        <UnitExplorer
          unit={selectedUnit}
          selectedSubunitId={selectedSubunitId}
          onSelectSubunit={setSelectedSubunitId}
        />

        <section className="mt-16 border-t border-black/[0.08] pt-10 sm:mt-20" aria-labelledby="record-guide-title">
          <div className="grid gap-8 lg:grid-cols-[1.25fr_0.75fr]">
            <div>
              <p className="text-[13px] font-bold uppercase tracking-[0.08em] text-[#8e8e93]">탐구 기록 가이드</p>
              <h2 id="record-guide-title" className="mt-2 text-[1.55rem] font-extrabold tracking-[-0.035em] sm:text-[1.9rem]">
                주제를 ‘나의 활동’으로 바꾸는 6단계
              </h2>
              <ol className="mt-5 grid gap-3 sm:grid-cols-2">
                {[
                  ['01', '궁금한 점을 질문으로 좁히기'],
                  ['02', '자료를 모으거나 조건 정하기'],
                  ['03', '식·표·그래프로 직접 표현하기'],
                  ['04', '계산값과 관찰값 비교하기'],
                  ['05', '오차와 모형의 한계 분석하기'],
                  ['06', '배운 점과 다음 질문 남기기'],
                ].map(([number, text]) => (
                  <li key={number} className="flex items-center gap-3 rounded-[1rem] bg-white p-4 text-[15px] font-semibold text-[#3a3a3c]">
                    <span className="text-[13px] font-extrabold text-[#007aff]">{number}</span>
                    {text}
                  </li>
                ))}
              </ol>
            </div>
            <aside className="rounded-[1.4rem] bg-[#1c1c1e] p-6 text-white sm:p-7">
              <h3 className="text-[1.15rem] font-bold">안전하고 정직한 탐구</h3>
              <ul className="mt-4 space-y-3 text-[15px] leading-6 text-white/75">
                <li>• 실제 주소와 개인정보 대신 가상 좌표나 익명 자료를 사용하세요.</li>
                <li>• 실험은 안전한 범위에서 하고, 위험한 장비는 사용하지 마세요.</li>
                <li>• 조사한 내용과 내가 직접 한 계산·해석을 구분하세요.</li>
              </ul>
            </aside>
          </div>
        </section>

        <section className="mt-10 rounded-[1.4rem] border border-black/[0.06] bg-white p-5 sm:p-7" aria-labelledby="sources-title">
          <p className="text-[13px] font-bold uppercase tracking-[0.08em] text-[#8e8e93]">Curriculum sources</p>
          <h2 id="sources-title" className="mt-1 text-[1.2rem] font-bold">교육과정 기준 자료</h2>
          <p className="mt-2 text-[15px] leading-6 text-[#636366]">
            단원 구조와 성취기준 코드는 2022 개정 교육과정의 공식·공공 자료를 기준으로 정리했습니다.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <a className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#f2f2f7] px-4 py-2 text-[14px] font-bold text-[#3a3a3c] hover:bg-[#e8e8ed] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#007aff]" href="https://www.moe.go.kr/boardCnts/viewRenew.do?boardID=141&boardSeq=93458&lev=0&searchType=null&status=" target="_blank" rel="noreferrer">
              교육부 고시 <ExternalLink className="size-4" aria-hidden="true" />
            </a>
            <a className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#f2f2f7] px-4 py-2 text-[14px] font-bold text-[#3a3a3c] hover:bg-[#e8e8ed] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#007aff]" href="https://www.goe.go.kr/resource/old/BBSMSTR_000000030136/BBS_202404250409254370.pdf" target="_blank" rel="noreferrer">
              경기도교육청 안내서 <ExternalLink className="size-4" aria-hidden="true" />
            </a>
            <a className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#f2f2f7] px-4 py-2 text-[14px] font-bold text-[#3a3a3c] hover:bg-[#e8e8ed] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#007aff]" href="https://cdn.kosac.re.kr/files/cms/attach/202501/253c33f280c14c3999b08364681fb62c_1736733732226.pdf" target="_blank" rel="noreferrer">
              교육과정 표준체계 <ExternalLink className="size-4" aria-hidden="true" />
            </a>
          </div>
        </section>
      </main>

      <footer className="safe-area-bottom border-t border-black/[0.06] bg-white/70 px-4 py-8 text-center text-[14px] text-[#8e8e93]">
        <p>공통수학2 탐구실 · 주제는 자신의 질문과 활동에 맞게 발전시켜 사용하세요.</p>
        <a href="#top" className="mx-auto mt-3 inline-flex min-h-11 items-center gap-1.5 rounded-full px-4 font-bold text-[#007aff] hover:bg-[#eef6ff] focus-visible:outline-2 focus-visible:outline-[#007aff]">
          맨 위로 <ArrowUp className="size-4" aria-hidden="true" />
        </a>
      </footer>
    </div>
  );
}
