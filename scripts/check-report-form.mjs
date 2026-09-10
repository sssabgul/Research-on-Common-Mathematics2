import assert from 'node:assert/strict';
import { allTopics } from '../lib/curriculum-utils.ts';
import { buildReportFormUrl, REPORT_FORM } from '../lib/report-form.ts';
import { SITE_URL } from '../lib/site.ts';

// URL 조립만 검사하는 가상 식별자. 외부 요청이나 테스트 답변 제출에 쓰지 않는다.
const fixture = {
  url: 'https://docs.google.com/forms/d/e/test-only/viewform?entry.999=example#old',
  entries: { unit: 'entry.101', topic: 'entry.102', link: 'entry.103' },
};

function checkTopic(entry, config) {
  const result = new URL(buildReportFormUrl(entry, config));
  assert.equal(result.origin, 'https://docs.google.com');
  assert.equal(result.pathname, new URL(config.url).pathname);
  assert.equal(result.hash, '');
  assert.equal(result.searchParams.get('usp'), 'pp_url');
  assert.equal(
    result.searchParams.size,
    4,
    '예시 답변이나 개인정보를 사전 입력하지 않는다',
  );
  assert.equal(
    result.searchParams.get(config.entries.unit),
    `${entry.unit.title} · ${entry.subunit.label}`,
  );
  assert.equal(
    result.searchParams.get(config.entries.topic),
    entry.topic.title,
  );
  const link = result.searchParams.get(config.entries.link);
  assert.equal(link, `${SITE_URL}${entry.href}`);
  assert.equal(
    new URL(link).hash,
    '',
    '상세 페이지를 목록 앵커로 바꾸지 않는다',
  );
}

for (const entry of allTopics) {
  checkTopic(entry, fixture);
  checkTopic(entry, REPORT_FORM);
}

const sample = allTopics[0];
checkTopic(
  {
    ...sample,
    unit: { ...sample.unit, title: '도형 & 집합 / 100%' },
    subunit: { ...sample.subunit, label: '1+1? #탐구=배움' },
    topic: { ...sample.topic, title: 'A&B / 1+1? #배움=100% “나의 생각”' },
  },
  fixture,
);
for (const url of [
  'https://example.com/forms/d/e/test-only/viewform',
  'https://docs.google.com/forms/d/test-only/edit',
  'http://docs.google.com/forms/d/e/test-only/viewform',
]) {
  assert.throws(() => buildReportFormUrl(sample, { ...fixture, url }));
}
assert.throws(() =>
  buildReportFormUrl(sample, {
    ...fixture,
    entries: { ...fixture.entries, link: fixture.entries.topic },
  }),
);
assert.throws(() =>
  buildReportFormUrl(sample, {
    ...fixture,
    entries: { ...fixture.entries, link: 'unknown' },
  }),
);

console.log(
  `OK — 보고서 링크 조립 ${allTopics.length}개 / 특수문자 / 설정 검증`,
);
