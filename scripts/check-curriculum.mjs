/**
 * 탐구 데이터 무결성 검사.
 *
 * id는 이제 URL 경로와 앵커로 쓰이므로 중복이나 오타가 그대로 깨진 링크가 된다.
 * 타입 검사가 못 잡는 "값" 수준의 문제를 여기서 잡는다.
 *
 * 실행: npm run check   (Node 22.18+ 또는 24 — .ts 타입 스트리핑 필요)
 */
import {
  curriculumUnits,
  LEVELS,
  TOPIC_KINDS,
} from '../lib/curriculum.ts';

const TONES = ['blue', 'purple', 'orange'];
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const STANDARD = /^\[10공수2-\d{2}-\d{2}(?:~\d{2})?\]$/;
const REQUIRED_TOPIC_FIELDS = [
  'title',
  'summary',
  'question',
  'method',
  'career',
  'curriculum',
  'style',
];

const problems = [];
const fail = (where, message) => problems.push(`${where}: ${message}`);

const seenUnitIds = new Set();
const seenSubunitIds = new Set();
let topicTotal = 0;

for (const unit of curriculumUnits) {
  const at = `대단원 '${unit.id}'`;

  if (!SLUG.test(unit.id)) fail(at, 'id가 URL 슬러그 형식이 아님');
  if (seenUnitIds.has(unit.id)) fail(at, 'id 중복');
  seenUnitIds.add(unit.id);
  if (!TONES.includes(unit.tone)) fail(at, `tone '${unit.tone}'은 정의되지 않음`);
  if (unit.subunits.length === 0) fail(at, '소단원이 없음');

  for (const subunit of unit.subunits) {
    const subAt = `${at} > 소단원 '${subunit.id}'`;

    if (!SLUG.test(subunit.id)) fail(subAt, 'id가 URL 슬러그 형식이 아님');
    // 소단원 id는 라우트 세그먼트라 사이트 전체에서 유일해야 헷갈리지 않는다.
    if (seenSubunitIds.has(subunit.id)) fail(subAt, 'id가 다른 대단원과 중복');
    seenSubunitIds.add(subunit.id);
    if (!STANDARD.test(subunit.standard)) {
      fail(subAt, `성취기준 코드 형식이 이상함: '${subunit.standard}'`);
    }
    if (subunit.topics.length === 0) fail(subAt, '주제가 없음');

    const seenTopicIds = new Set();
    for (const topic of subunit.topics) {
      const topicAt = `${subAt} > 주제 '${topic.id}'`;
      topicTotal += 1;

      // 주제 id는 페이지 안의 앵커(#id)라 소단원 안에서만 유일하면 된다.
      if (!SLUG.test(topic.id)) fail(topicAt, 'id가 앵커 슬러그 형식이 아님');
      if (seenTopicIds.has(topic.id)) fail(topicAt, 'id 중복');
      seenTopicIds.add(topic.id);

      if (!LEVELS.includes(topic.level)) {
        fail(topicAt, `level '${topic.level}'은 정의되지 않음`);
      }
      if (!TOPIC_KINDS.includes(topic.kind)) {
        fail(topicAt, `kind '${topic.kind}'은 정의되지 않음`);
      }
      for (const field of REQUIRED_TOPIC_FIELDS) {
        if (!topic[field] || topic[field].trim() === '') {
          fail(topicAt, `${field}가 비어 있음`);
        }
      }
    }
  }
}

if (problems.length > 0) {
  console.error(`데이터 문제 ${problems.length}건:\n`);
  for (const problem of problems) console.error(`  - ${problem}`);
  process.exit(1);
}

console.log(
  `OK — 대단원 ${seenUnitIds.size} / 소단원 ${seenSubunitIds.size} / 주제 ${topicTotal}`,
);
