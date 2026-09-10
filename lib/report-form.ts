import type { TopicEntry } from './curriculum-utils.ts';
import { SITE_URL } from './site.ts';

export type ReportFormConfig = {
  /** Google Forms의 응답자용 전체 주소. 관리용 /edit 주소를 넣지 않는다. */
  url: string;
  entries: { unit: string; topic: string; link: string };
};

/** 실제 양식의 사전 입력 링크에서 확인한 공개 값만 등록한다. */
export const REPORT_FORM: ReportFormConfig = {
  url: 'https://docs.google.com/forms/d/e/1FAIpQLSfAaihsVvH1jm56RMu6isd85Jz_z1_-ty_zB-WoQnlZj7LKlw/viewform',
  entries: {
    unit: 'entry.12164861',
    topic: 'entry.64204507',
    link: 'entry.1237976543',
  },
};

export function buildReportFormUrl(
  { unit, subunit, topic, href }: TopicEntry,
  config: ReportFormConfig = REPORT_FORM,
): string {
  const url = new URL(config.url);
  if (
    url.origin !== 'https://docs.google.com' ||
    !/^\/forms\/d\/(?:e\/)?[\w-]+\/viewform$/.test(url.pathname) ||
    url.username ||
    url.password
  ) {
    throw new Error(
      '탐구보고서 양식에는 Google Forms 응답자 주소가 필요합니다.',
    );
  }

  const entries = Object.values(config.entries);
  if (
    entries.some((entry) => !/^entry\.\d+$/.test(entry)) ||
    new Set(entries).size !== 3
  ) {
    throw new Error('단원·주제·링크의 서로 다른 entry 식별자를 확인하세요.');
  }

  // 사전 입력 예시에 남아 있는 답변이나 관리용 쿼리를 전달하지 않는다.
  url.search = new URLSearchParams({
    usp: 'pp_url',
    [config.entries.unit]: `${unit.title} · ${subunit.label}`,
    [config.entries.topic]: topic.title,
    [config.entries.link]: new URL(href, SITE_URL).href,
  }).toString();
  url.hash = '';
  return url.href;
}
