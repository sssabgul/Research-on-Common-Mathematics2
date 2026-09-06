import assert from 'node:assert/strict';
import katex from 'katex';
import { topicDetails } from '../lib/topic-details.ts';
import {
  allTopics,
  findTopic,
  searchTopics,
  topicHref,
  topicDetailHref,
} from '../lib/curriculum-utils.ts';

const text = (value, name) =>
  assert.ok(typeof value === 'string' && value.trim(), name + ' 내용 누락');
const expected = new Set(
  allTopics.map(({ unit, subunit, topic }) =>
    [unit.id, subunit.id, topic.id].join('/'),
  ),
);
assert.deepEqual(
  new Set(Object.keys(topicDetails)),
  expected,
  '요약과 상세 원고의 주제 목록 불일치',
);
let formulas = 0;
for (const [key, d] of Object.entries(topicDetails)) {
  text(d.background, key);
  assert.ok(d.concepts.length >= 2 && d.concepts.length <= 4, key + ' 개념 수');
  assert.ok(d.steps.length >= 4 && d.steps.length <= 6, key + ' 활동 단계 수');
  assert.ok(
    d.reflection.length >= 2 && d.reflection.length <= 3,
    key + ' 해석 질문 수',
  );
  assert.equal(d.extensions.length, 2, key + ' 확장 질문 수');
  assert.ok(d.sources.length >= 1 && d.sources.length <= 3, key + ' 출처 수');
  text(d.example.title, key + ' 예제 제목');
  assert.ok(d.example.paragraphs.length >= 2, key + ' 예제 설명');
  for (const p of [...d.example.paragraphs, ...d.reflection, ...d.extensions])
    text(p, key);
  for (const step of d.steps)
    for (const field of ['title', 'action', 'output'])
      text(step[field], key + '/' + field);
  for (const concept of d.concepts) {
    text(concept.name, key);
    text(concept.explanation, key);
  }
  for (const field of ['curriculum', 'career'])
    text(d.connections[field], key + '/connections');
  for (const source of d.sources) {
    assert.equal(new URL(source.url).protocol, 'https:', key + ' 출처 URL');
    text(source.title, key);
    text(source.note, key);
  }
  const math = [
    ...d.concepts.map((c) => c.formula).filter(Boolean),
    ...(d.example.math ?? []),
  ];
  for (const formula of math) {
    const html = katex.renderToString(formula, {
      throwOnError: true,
      trust: false,
      output: 'htmlAndMathml',
    });
    assert.ok(html.includes('<math'), key + ' MathML 누락');
    formulas++;
  }
  if (d.example.table) {
    const { headers, rows, caption } = d.example.table;
    text(caption, key);
    assert.ok(headers.length > 0 && rows.length > 0, key + ' 빈 표');
    for (const row of rows) {
      assert.equal(row.length, headers.length, key + ' 표 열 수');
      for (const cell of row) text(cell, key);
    }
  }
  if (d.example.plot) {
    const plot = d.example.plot;
    for (const range of [plot.xRange, plot.yRange])
      assert.ok(range[0] < range[1], key + ' 그래프 범위');
    for (const line of plot.series)
      for (const [x, y] of line.points) {
        assert.ok(Number.isFinite(x) && Number.isFinite(y), key + ' 유한 좌표');
        assert.ok(
          x >= plot.xRange[0] &&
            x <= plot.xRange[1] &&
            y >= plot.yRange[0] &&
            y <= plot.yRange[1],
          key + ' 표시 범위 밖 좌표',
        );
      }
  }
}

// 단원 조합이 잘못된 경로는 같은 주제 id가 있더라도 연결하지 않는다.
assert.equal(findTopic('logic', 'function', 'self-inverse'), undefined);
assert.equal(findTopic('functions', 'function', 'unknown'), undefined);
for (const { unit, subunit, topic, href } of allTopics) {
  assert.equal(href, topicDetailHref(unit.id, subunit.id, topic.id));
  assert.equal(
    topicHref(unit.id, subunit.id, topic.id),
    '/' + unit.id + '/' + subunit.id + '#' + topic.id,
  );
  assert.equal(findTopic(unit.id, subunit.id, topic.id)?.topic.id, topic.id);
  assert.ok(
    searchTopics({ query: topic.title, subunitIds: [subunit.id] }).some(
      (e) => e.href === href,
    ),
  );
}
for (const [query, ids] of [
  [
    '경제학과',
    [
      'price-revenue-logic',
      'inverse-demand',
      'progressive-tax',
      'discount-framing',
    ],
  ],
  ['수학과', ['apollonius-circle', 'infinite-cardinality', 'self-inverse']],
]) {
  const found = new Set(searchTopics({ query }).map((e) => e.topic.id));
  for (const id of ids) assert.ok(found.has(id), query + ': ' + id);
}
assert.equal(searchTopics({ query: '없는주제xyz' }).length, 0);
assert.ok(
  searchTopics({ subunitIds: ['circle'], kinds: ['증명·논증'] }).some(
    (e) => e.topic.id === 'apollonius-circle',
  ),
);

// 표시된 신규 예제 표의 수치를 독립적인 산술 조건으로 확인한다.
assert.equal(findTopic('logic', 'propositions', 'irrational-sums'), undefined);
assert.equal(
  findTopic('logic', 'sets', 'infinite-cardinality')?.topic.kind,
  '증명·논증',
);
assert.ok(
  searchTopics({ query: '1+1', subunitIds: ['function'] }).some(
    (e) => e.topic.id === 'discount-framing',
  ),
);
for (const row of topicDetails['functions/function/discount-framing'].example
  .table.rows) {
  const [n, qa, fa, qb, fb, qc, fc] = row.map(Number);
  const bundles = Math.ceil(n / 2);
  assert.equal(qa, n);
  assert.equal(fa, 1000 * n);
  assert.equal(qb, 2 * bundles);
  assert.equal(qc, qb);
  assert.equal(fb, 2000 * bundles);
  assert.equal(fc, fb);
  assert.ok(qb >= n && qb - n <= 1);
  if (n > 0) {
    assert.equal(fa / qa, 1000);
    assert.equal(fb / qb, 1000);
    assert.equal(fc / qc, 1000);
  }
}
// 유한한 표의 자릿수만 검산하며, 비가산성의 증명 자체를 대신하지 않는다.
for (const [n, decimal, diagonal, changed] of topicDetails[
  'logic/sets/infinite-cardinality'
].example.table.rows) {
  assert.equal(decimal.slice(2)[Number(n) - 1], diagonal);
  assert.equal(changed, diagonal === '1' ? '2' : '1');
  assert.notEqual(diagonal, changed);
}
const rows =
  topicDetails['logic/propositions/price-revenue-logic'].example.table.rows;
for (const row of rows) {
  const [price, quantity, revenue] = row.map((v) =>
    Number(v.replaceAll(',', '')),
  );
  assert.equal(price * quantity, revenue);
}
for (const row of topicDetails['functions/function/progressive-tax'].example
  .table.rows) {
  const [income, tax, net] = row.map(Number);
  const expectedTax =
    Math.min(income, 100) * 0.1 + Math.max(income - 100, 0) * 0.2;
  assert.ok(
    Math.abs(tax - expectedTax) < 1e-9 && Math.abs(net - (income - tax)) < 1e-9,
  );
}
const point = topicDetails[
  'functions/function/inverse-demand'
].example.plot.series.find((s) => s.label === '균형').points[0];
const [q, p] = point;
assert.equal(q, 120 - 2 * p);
assert.equal(q, 20 + 3 * p);
const circle =
  topicDetails['geometry/circle/apollonius-circle'].example.plot.circles[0];
for (const angle of [0, Math.PI / 3, Math.PI / 2, Math.PI]) {
  const x = circle.x + circle.r * Math.cos(angle);
  const y = circle.y + circle.r * Math.sin(angle);
  assert.ok(Math.abs(Math.hypot(x, y) / Math.hypot(x - 6, y) - 2) < 1e-9);
}
console.log(
  'OK — 상세 원고 ' +
    expected.size +
    '개 / 수식 ' +
    formulas +
    '개 / 링크·검색·주요 예제 검산',
);
