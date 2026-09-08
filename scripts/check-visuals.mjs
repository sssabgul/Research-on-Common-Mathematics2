import assert from 'node:assert/strict';
import { allTopics } from '../lib/curriculum-utils.ts';
import { topicVisuals, EXCLUDED_VISUAL_KEYS } from '../lib/topic-visuals.ts';
import {
  geometryScene,
  weightedHub,
  movingPoints,
  circleRelation,
  wifiSamples,
  apollonius,
  reflect,
  translate,
  epicenterCandidate,
  fitting,
} from '../lib/visuals/geometry.ts';
import {
  logicScene,
  similarity,
  intersection,
  difference,
  clubRule,
  passwordRule,
  viaDistance,
  revenue,
  MENUS,
} from '../lib/visuals/logic.ts';
import {
  functionScene,
  parkingFee,
  filterResults,
  clipBrightness,
  equilibrium,
  tax,
  applyFunction,
  purchase,
  groupCost,
  averageSpeed,
  lensDistance,
  pendulumPeriod,
  horizon,
} from '../lib/visuals/functions.ts';
import { squaredDistance, niceTicks } from '../lib/visuals/shared.ts';
import { topicDetails } from '../lib/topic-details.ts';

const close = (actual, expected, message) =>
  assert.ok(
    Math.abs(actual - expected) < 1e-8,
    (message ?? '') + ': ' + actual + ' ≠ ' + expected,
  );
assert.deepEqual(
  [...EXCLUDED_VISUAL_KEYS],
  ['geometry/section-point/bezier', 'logic/propositions/even-square-proof'],
);
const expected = allTopics
  .map(({ unit, subunit, topic }) => [unit.id, subunit.id, topic.id].join('/'))
  .filter((key) => !EXCLUDED_VISUAL_KEYS.includes(key));
assert.equal(topicVisuals.length, 41);
assert.equal(new Set(topicVisuals.map((v) => v.key)).size, 41);
assert.deepEqual(new Set(topicVisuals.map((v) => v.key)), new Set(expected));
const staticIds = [
  'centroid',
  'ramp-slope',
  'traditional-pattern',
  'bus-transfer',
  'infinite-cardinality',
  'ad-quantifiers',
  'convex-lens',
  'pendulum',
  'horizon-distance',
];
assert.deepEqual(
  new Set(
    topicVisuals
      .filter((v) => v.mode === 'static')
      .map((v) => v.key.split('/').at(-1)),
  ),
  new Set(staticIds),
);

function inspect(value, path) {
  if (typeof value === 'number')
    assert.ok(Number.isFinite(value), path + ': non-finite');
  else if (Array.isArray(value))
    value.forEach((v, i) => inspect(v, path + '/' + i));
  else if (value && typeof value === 'object')
    Object.entries(value).forEach(([key, v]) => inspect(v, path + '/' + key));
}
function validateScene(scene, key) {
  assert.ok(
    scene.diagrams.length > 0 && scene.facts.length > 0,
    key + ': empty scene',
  );
  inspect(scene, key);
  scene.diagrams.forEach((d) => {
    assert.ok(d.title.trim(), key + ': missing diagram title');
    if (d.kind === 'plot') {
      const [xmin, xmax, ymin, ymax] = d.bounds;
      assert.ok(xmin < xmax && ymin < ymax, key + ': plot bounds');
      for (const c of d.circles ?? [])
        assert.ok(c.radius > 0, key + ': positive radius');
    }
    if (d.kind === 'mapping')
      for (const [a, b] of d.links)
        assert.ok(
          d.left[a] !== undefined && d.right[b] !== undefined,
          key + ': mapping endpoints',
        );
    if (d.kind === 'bars')
      for (const row of d.rows)
        for (const v of row.values)
          assert.ok(v.value >= 0, key + ': bar magnitude');
    if (d.kind === 'items')
      assert.ok(
        Number.isInteger(d.needed) &&
          Number.isInteger(d.received) &&
          d.received >= d.needed,
      );
  });
  if (scene.table)
    for (const row of scene.table.rows)
      assert.equal(
        row.length,
        scene.table.headers.length,
        key + ': table columns',
      );
}
let sceneCount = 0;
for (const definition of topicVisuals) {
  assert.ok(definition.title && definition.question);
  const [unit, , id] = definition.key.split('/');
  const evaluate = {
    geometry: geometryScene,
    logic: logicScene,
    functions: functionScene,
  }[unit];
  const states = [definition.initial];
  if (definition.mode === 'static') assert.equal(definition.controls.length, 0);
  else assert.ok(definition.controls.length > 0);
  for (const control of definition.controls) {
    assert.ok(
      Object.hasOwn(definition.initial, control.id),
      definition.key + ': initial control value',
    );
    let values;
    if (control.kind === 'range') {
      assert.ok(control.min < control.max && control.step > 0);
      assert.ok(
        definition.initial[control.id] >= control.min &&
          definition.initial[control.id] <= control.max,
      );
      values = [
        ...new Set([
          control.min,
          control.max,
          ...(control.presets ?? []),
          definition.initial[control.id],
        ]),
      ];
    } else if (control.kind === 'choice') {
      assert.ok(
        control.options.some((o) => o.value === definition.initial[control.id]),
      );
      values = control.options.map((o) => o.value);
    } else values = [[], control.options, control.options.slice(0, 1)];
    for (const value of values)
      states.push({ ...definition.initial, [control.id]: value });
  }
  if (id === 'taste-recommendation') {
    states.push({ ...definition.initial, a: [], b: [] });
    const choices = definition.controls.find((c) => c.id === 'a').options;
    states.push({ ...definition.initial, a: choices, b: choices });
  }
  if (id === 'self-inverse')
    for (const x of [-4, -0.5, 0.5, 4])
      states.push({ ...definition.initial, fn: 'reciprocal', x });
  const unchanged = JSON.stringify(states);
  for (const state of states) {
    validateScene(evaluate(id, state), definition.key);
    sceneCount++;
  }
  assert.equal(
    JSON.stringify(states),
    unchanged,
    definition.key + ': evaluator mutated input',
  );
}
assert.deepEqual(weightedHub(30), [2, 1]);
assert.deepEqual(weightedHub(20), [4, 2]);
assert.deepEqual(weightedHub(10), [6, 3]);
assert.deepEqual(movingPoints(4, 0), [
  [4, 0],
  [4, 2],
]);
assert.deepEqual(movingPoints(4, 1), [
  [4, 0],
  [4, 0],
]);
assert.deepEqual(movingPoints(0.5, 1)[1], [4, -6]);
close(fitting(1).squaredError, 0.04);
close(fitting(0.9).squaredError, 0.01);
assert.deepEqual(epicenterCandidate(0), [3, 4]);
const candidate = epicenterCandidate(0.2);
close(candidate[1], 3.8725);
for (const [center, r] of [
  [[0, 0], 5],
  [[6, 0], 5],
  [[0, 8], 5.2],
])
  close(squaredDistance(candidate, center) - r * r, -1.00374375);
for (const [radius, covered, both] of [
  [2, 25, 1],
  [3, 49, 7],
  [4, 63, 19],
]) {
  const samples = wifiSamples(radius);
  assert.equal(samples.length, 63);
  assert.equal(samples.filter((v) => v.count > 0).length, covered);
  assert.equal(samples.filter((v) => v.count === 2).length, both);
}
for (const [d, intersections, overlaps] of [
  [4, 0, false],
  [3, 1, true],
  [2, 2, true],
  [1, 1, true],
  [0.5, 0, true],
  [0, 0, true],
])
  assert.deepEqual(
    [circleRelation(d).intersections, circleRelation(d).overlaps],
    [intersections, overlaps],
  );
assert.equal(circleRelation(0, 2, 2).intersections, Infinity);
assert.deepEqual(apollonius(1), { kind: 'line', x: 3 });
for (const k of [0.5, 2, 3]) {
  const locus = apollonius(k);
  for (const angle of [0, Math.PI / 3, Math.PI]) {
    const p = [
      locus.center[0] + locus.radius * Math.cos(angle),
      locus.radius * Math.sin(angle),
    ];
    close(squaredDistance(p, [0, 0]) / squaredDistance(p, [6, 0]), k * k);
  }
}
assert.deepEqual(reflect([2, 3], 'x'), [2, -3]);
assert.deepEqual(reflect([2, 3], 'y'), [-2, 3]);
assert.deepEqual(reflect([2, 3], 'origin'), [-2, -3]);
for (const axis of ['x', 'y'])
  for (const p of [-3, 0, 3])
    for (const q of [-2, 0, 2]) {
      const a = translate(reflect([1, 2], axis), p, q),
        b = reflect(translate([1, 2], p, q), axis);
      close(a[0] - b[0], axis === 'y' ? 2 * p : 0);
      close(a[1] - b[1], axis === 'x' ? 2 * q : 0);
    }
close(similarity(['음악', '게임', '영화'], ['게임', '영화', '독서']), 0.5);
assert.equal(similarity([], []), null);
assert.equal(similarity([], ['음악']), 0);
assert.deepEqual(intersection(MENUS.M2, ['우유', '달걀']), []);
assert.equal(MENUS.M4, null);
assert.deepEqual(
  difference(['보기', '댓글', '업로드', '삭제'], ['보기', '댓글', '업로드']),
  ['삭제'],
);
const boolPairs = [
  [true, true],
  [true, false],
  [false, true],
  [false, false],
];
for (const [rule, values] of [
  ['necessary', [true, true, false, true]],
  ['sufficient', [true, false, true, true]],
  ['both', [true, false, false, true]],
])
  assert.deepEqual(
    boolPairs.map(([p, q]) => clubRule(p, q, rule)),
    values,
  );
for (const [rule, values] of [
  ['and', [true, false, false, false]],
  ['or', [true, true, true, false]],
  ['not-and', [false, true, true, true]],
  ['neither', [false, false, false, true]],
])
  assert.deepEqual(
    boolPairs.map(([a, b]) => passwordRule(a, b, rule)),
    values,
  );
for (const [x, expectedDistance] of [
  [-2, 14],
  [2, 6],
  [5, 6],
  [8, 6],
  [10, 10],
  [12, 14],
])
  assert.equal(viaDistance(x), expectedDistance);
for (const [discount, min] of [
  [10, 112],
  [20, 126],
  [30, 143],
]) {
  assert.equal(revenue(discount, min).minimum, min);
  assert.ok(revenue(discount, min).revenue > 100000);
  assert.ok(revenue(discount, min - 1).revenue <= 100000);
}
for (const [t, fee] of [
  [0, 2000],
  [1, 2000],
  [1.01, 3000],
  [2, 3000],
  [2.01, 4000],
])
  assert.equal(parkingFee(t), fee);
assert.equal(filterResults(100).brightThenContrast, 180);
assert.equal(filterResults(100).contrastThenBright, 170);
assert.equal(filterResults(240).bright, filterResults(250).bright);
assert.equal(clipBrightness(-1), 0);
assert.equal(clipBrightness(300), 255);
assert.deepEqual(equilibrium(120), { price: 20, quantity: 80 });
assert.deepEqual(equilibrium(140), { price: 24, quantity: 92 });
for (const row of topicDetails['functions/function/progressive-tax'].example
  .table.rows) {
  const [income, total, net] = row.map(Number);
  close(tax(income).total, total);
  close(tax(income).net, net);
}
for (const fn of ['identity', 'reflection', 'reciprocal'])
  for (const x of [-4, -0.5, 0.5, 1, 4])
    close(applyFunction(applyFunction(x, fn), fn), x);
assert.ok(Number.isNaN(applyFunction(0, 'reciprocal')));
assert.notEqual(applyFunction(applyFunction(1, 'shift'), 'shift'), 1);
for (const row of topicDetails['functions/function/discount-framing'].example
  .table.rows) {
  const [count, qa, ca, qb, cb, qc, cc] = row.map(Number),
    result = purchase(count);
  assert.deepEqual(
    [
      result.singleCount,
      result.singleCost,
      result.bundleCount,
      result.bundleCost,
    ],
    [qa, ca, qb, cb],
  );
  assert.equal(qb, qc);
  assert.equal(cb, cc);
}
assert.equal(purchase(0).unitPrice, null);
for (const [count, expectedCost] of [
  [1, 14000],
  [2, 11000],
  [3, 10000],
  [6, 9000],
])
  assert.equal(groupCost(count), expectedCost);
close(averageSpeed(30), 40);
close(averageSpeed(60), 60);
for (const [u, v] of [
  [30, 15],
  [20, 20],
  [15, 30],
  [11, 110],
])
  close(lensDistance(u), v);
assert.ok(Number.isNaN(lensDistance(10)));
close(pendulumPeriod(1) / pendulumPeriod(0.25), 2);
close(pendulumPeriod(0.25), 1.0035449615772465);
close(horizon(10).exact, 11.288051204694913);
assert.ok(
  Math.abs((horizon(10).exact - horizon(10).approximate) * 1e6 - 4.42946) <
    0.0001,
);
for (const [min, max] of [
  [-0.4, 2.5],
  [-0.35, 1.1],
  [0, 4600],
]) {
  const ticks = niceTicks(min, max);
  assert.ok(ticks.every((v) => v >= min && v <= max));
  assert.ok(ticks.length >= 2 && ticks.length <= 6);
}
console.log(
  'OK — 시각자료 41개 (정적 9 / 조작형 32) / ' +
    sceneCount +
    '개 상태 / 기본값·경계·집합·함수 검산',
);
