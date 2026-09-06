import assert from 'node:assert/strict';
import {
  BEZIER_PRESETS,
  constructBezier,
  sampleBezier,
  clampCoordinate,
  plotX,
  plotY,
  bezierSvg,
} from '../lib/bezier.ts';

const close = (a, b) => assert.ok(Math.abs(a - b) < 1e-10, a + ' != ' + b);
const original = JSON.stringify(BEZIER_PRESETS);
const basic = BEZIER_PRESETS[0].points;
assert.deepEqual(constructBezier(basic, 0.5), {
  d: { x: 1, y: 2 },
  e: { x: 3, y: 2 },
  q: { x: 2, y: 2 },
});
for (const points of [
  ...BEZIER_PRESETS.map((p) => p.points),
  [
    { x: 1, y: 1 },
    { x: 1, y: 1 },
    { x: 1, y: 1 },
  ],
  [
    { x: 0, y: 0 },
    { x: 4, y: 4 },
    { x: 0, y: 0 },
  ],
]) {
  assert.deepEqual(constructBezier(points, 0).q, points[0]);
  assert.deepEqual(constructBezier(points, 1).q, points[2]);
  for (let i = 0; i <= 100; i++) {
    const t = i / 100;
    const { d, e, q } = constructBezier(points, t);
    for (const axis of ['x', 'y']) {
      close(
        q[axis],
        (1 - t) ** 2 * points[0][axis] +
          2 * t * (1 - t) * points[1][axis] +
          t * t * points[2][axis],
      );
      assert.ok(q[axis] >= Math.min(...points.map((p) => p[axis])) - 1e-10);
      assert.ok(q[axis] <= Math.max(...points.map((p) => p[axis])) + 1e-10);
      close(d[axis], (1 - t) * points[0][axis] + t * points[1][axis]);
      close(e[axis], (1 - t) * points[1][axis] + t * points[2][axis]);
    }
    const reverse = constructBezier([...points].reverse(), 1 - t).q;
    close(q.x, reverse.x);
    close(q.y, reverse.y);
  }
  const samples = sampleBezier(points, 11);
  assert.equal(samples.length, 11);
  assert.deepEqual(samples[0], points[0]);
  assert.deepEqual(samples[10], points[2]);
  assert.deepEqual(
    sampleBezier(points, 101, 0.37).at(-1),
    constructBezier(points, 0.37).q,
  );
  const svg = bezierSvg(points);
  assert.ok(svg.startsWith('<svg xmlns="http://www.w3.org/2000/svg"'));
  assert.equal((svg.match(/<circle /g) ?? []).length, 3);
  assert.ok(!/NaN|Infinity|<script|http[s]?:\/\/(?!www.w3.org)/.test(svg));
}
assert.throws(() => sampleBezier(basic, 1), RangeError);
assert.equal(clampCoordinate(-8), -1);
assert.equal(clampCoordinate(8), 5);
assert.equal(clampCoordinate(2.34), 2.3);
assert.equal(plotX(-1), 40);
assert.equal(plotX(5), 440);
assert.equal(plotY(-1), 440);
assert.equal(plotY(5), 40);
assert.equal(JSON.stringify(BEZIER_PRESETS), original, 'preset mutation');
console.log('OK — 베지어 내분 505개 사례 / 끝점·대칭·겹친 점·표·그림 내보내기');
