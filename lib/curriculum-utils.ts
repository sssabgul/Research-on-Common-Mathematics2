import {
  curriculumUnits,
  type CurriculumUnit,
  type Level,
  type Subunit,
  type Topic,
  type TopicKind,
} from '@/lib/curriculum';

/** 대단원·소단원·주제를 한 줄로 펼친 항목. 검색과 사이트맵이 공용으로 쓴다. */
export type TopicEntry = {
  unit: CurriculumUnit;
  subunit: Subunit;
  topic: Topic;
  /** 이 주제로 바로 가는 경로. 예: `/geometry/circle#geofence` */
  href: string;
};

export type SubunitEntry = {
  unit: CurriculumUnit;
  subunit: Subunit;
  href: string;
};

export function subunitHref(unitId: string, subunitId: string): string {
  return `/${unitId}/${subunitId}`;
}

export function topicHref(
  unitId: string,
  subunitId: string,
  topicId: string,
): string {
  return `${subunitHref(unitId, subunitId)}#${topicId}`;
}

/** 모든 (대단원, 소단원) 쌍. generateStaticParams와 사이트맵이 쓴다. */
export const allSubunits: SubunitEntry[] = curriculumUnits.flatMap((unit) =>
  unit.subunits.map((subunit) => ({
    unit,
    subunit,
    href: subunitHref(unit.id, subunit.id),
  })),
);

/** 모든 주제를 펼친 목록. */
export const allTopics: TopicEntry[] = curriculumUnits.flatMap((unit) =>
  unit.subunits.flatMap((subunit) =>
    subunit.topics.map((topic) => ({
      unit,
      subunit,
      topic,
      href: topicHref(unit.id, subunit.id, topic.id),
    })),
  ),
);

// 화면에 보이는 수치는 전부 데이터에서 파생한다. 하드코딩하면 데이터가 늘었을 때
// 화면이 조용히 거짓말을 하게 된다.
export const unitCount = curriculumUnits.length;
export const subunitCount = allSubunits.length;
export const totalTopicCount = allTopics.length;

export function findUnit(unitId: string): CurriculumUnit | undefined {
  return curriculumUnits.find((unit) => unit.id === unitId);
}

export function findSubunit(
  unitId: string,
  subunitId: string,
): SubunitEntry | undefined {
  return allSubunits.find(
    (entry) => entry.unit.id === unitId && entry.subunit.id === subunitId,
  );
}

function normalize(text: string): string {
  return text.normalize('NFC').toLowerCase();
}

type SearchEntry = TopicEntry & { haystack: string };

/**
 * 주제 36개짜리 전문 검색 인덱스.
 * 이 규모에서는 `includes` 한 번이면 충분해 검색 라이브러리를 쓰지 않는다.
 */
const searchIndex: SearchEntry[] = allTopics.map((entry) => ({
  ...entry,
  haystack: normalize(
    [
      entry.topic.title,
      entry.topic.summary,
      entry.topic.question,
      entry.topic.method,
      entry.topic.career,
      entry.topic.curriculum,
      entry.topic.style,
      entry.topic.kind,
      entry.topic.level,
      entry.subunit.label,
      entry.subunit.official,
      entry.unit.title,
    ].join(' '),
  ),
}));

export type TopicFilter = {
  query?: string;
  levels?: readonly Level[];
  kinds?: readonly TopicKind[];
  subunitIds?: readonly string[];
};

export function searchTopics({
  query = '',
  levels = [],
  kinds = [],
  subunitIds = [],
}: TopicFilter): TopicEntry[] {
  const needle = normalize(query.trim());

  return searchIndex.filter(({ haystack, subunit, topic }) => {
    if (needle && !haystack.includes(needle)) return false;
    if (levels.length > 0 && !levels.includes(topic.level)) return false;
    if (kinds.length > 0 && !kinds.includes(topic.kind)) return false;
    if (subunitIds.length > 0 && !subunitIds.includes(subunit.id)) return false;
    return true;
  });
}
