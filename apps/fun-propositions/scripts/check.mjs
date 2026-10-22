import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { parseSource, inline, loadPropositions } from './content.mjs';
import {
  summaries,
  formulas,
  concepts,
  reflections,
  groups,
} from '../src/catalog.js';
import { primeResult, digitResult } from '../src/math.js';

const source = await readFile(
  new URL('../content/propositions.md', import.meta.url),
  'utf8',
);
const items = await loadPropositions();
assert.deepEqual(
  items.filter((p) => p.id <= 12),
  parseSource(source).filter((p) => p.id !== 5),
  '유지하는 기존 원문 보존',
);
assert.deepEqual(
  items.map((p) => p.id),
  [1, 2, 3, 4, 6, 7, 8, 9, 10, 11, 12, 13, 14, 19, 20],
);
assert.deepEqual(
  items.filter((p) => !p.answer).map((p) => p.id),
  [2, 3, 20],
);
for (const item of items) {
  for (const field of [
    'title',
    'statement',
    'verdict',
    'proof',
    'insight',
    'connection',
  ])
    assert.ok(item[field], `${item.id}: ${field}`);
  assert.ok(!item.proof.includes('katex-error'));
  assert.ok(
    !item.proof.includes('---'),
    `${item.id}: section separator leaked`,
  );
}
assert.deepEqual(
  items.filter((p) => p.condition).map((p) => p.id),
  [6, 7, 10, 12, 13, 14, 19, 20],
);
for (const list of [summaries, formulas, concepts, reflections]) {
  assert.ok(items.every((p) => typeof list[p.id - 1] === 'string'));
  assert.ok(
    list.every((value) => typeof value === 'string' && value.length > 0),
  );
}
assert.deepEqual(
  groups
    .flatMap((group) =>
      items.filter((p) => p.id >= group.start && p.id <= group.end),
    )
    .map((p) => p.id),
  items.map((p) => p.id),
);
assert.deepEqual(
  groups.map(
    (group) =>
      items.filter((p) => p.id >= group.start && p.id <= group.end).length,
  ),
  [5, 9, 1],
);
for (const item of items.filter((p) => p.id >= 13)) {
  assert.ok(item.backward && item.forward, `${item.id}: 분석과 정방향 확인`);
}
assert.deepEqual(
  items.filter((p) => p.kind === 'paradox').map((p) => p.id),
  [20],
);
const barber = items.find((p) => p.id === 20);
assert.equal(barber.answer, false);
assert.match(barber.statement, /모든 주민/);
assert.match(barber.condition, /이발사 자신도/);
assert.match(barber.proof, /반대 방향도 필요/);
assert.match(barber.verdict, /존재할 수 없다/);
for (const selfShaves of [false, true])
  assert.equal(selfShaves === !selfShaves, false);
// 사례 검산은 일반적인 증명을 대신하지 않는다. 일반 논증은 원고에서 별도로 검토한다.
for (let n = -100; n <= 100; n++) {
  assert.equal((2 * n + 1) ** 2 % 8, 1);
  assert.ok((n * (n + 1) * (n + 2)) % 6 === 0);
}
assert.match(items.find((p) => p.id === 9).proof, /<table>/);
assert.match(items.find((p) => p.id === 9).verdict, /무한집합/);
assert.match(items.find((p) => p.id === 12).condition, /한 시점/);
assert.match(items.find((p) => p.id === 10).condition, /경계/);
assert.match(inline('<img src=x onerror=alert(1)>'), /^&lt;img/);
for (let n = 1; n <= 39; n++) assert.equal(primeResult(n).prime, true);
assert.deepEqual(primeResult(40), { value: 1681, factor: 41, prime: false });
assert.throws(() => primeResult(0), RangeError);
assert.throws(() => primeResult(1.5), RangeError);
assert.deepEqual(digitResult('752'), {
  original: 752,
  reversed: 257,
  difference: 495,
  quotient: 55,
});
assert.equal(digitResult('10').difference, 9);
assert.equal(digitResult('123').quotient, -22);
assert.equal(digitResult('111').difference, 0);
assert.equal(digitResult('000').difference, 0);
for (const invalid of ['', '-1', '1.5', '<script>', '1234567890'])
  assert.equal(digitResult(invalid), null);
for (let n = 0; n < 10000; n++)
  assert.ok(digitResult(String(n)).difference % 9 === 0);
console.log(
  '통과: 남은 원문 보존·총 15개·3개 파트·분석과 증명·이발사 모순·수식·수치 교차검산·기존 계산 및 입력',
);
