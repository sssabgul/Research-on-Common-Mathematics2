export type Point = { x: number; y: number };
export type ControlPoints = [Point, Point, Point];

export const BEZIER_PRESETS: { name: string; points: ControlPoints }[] = [
  {
    name: '기본 아치',
    points: [
      { x: 0, y: 0 },
      { x: 2, y: 4 },
      { x: 4, y: 0 },
    ],
  },
  {
    name: '기울어진 곡선',
    points: [
      { x: 0, y: 0 },
      { x: 0, y: 4 },
      { x: 4, y: 2 },
    ],
  },
  {
    name: '일직선',
    points: [
      { x: 0, y: 0 },
      { x: 2, y: 2 },
      { x: 4, y: 4 },
    ],
  },
];

export function interpolate(a: Point, b: Point, t: number): Point {
  return { x: (1 - t) * a.x + t * b.x, y: (1 - t) * a.y + t * b.y };
}

/** AD:DB = BE:EC = DQ:QE = t:(1-t), with endpoints at t=0 and 1. */
export function constructBezier([a, b, c]: ControlPoints, t: number) {
  const d = interpolate(a, b, t);
  const e = interpolate(b, c, t);
  return { d, e, q: interpolate(d, e, t) };
}

export function sampleBezier(
  points: ControlPoints,
  count = 101,
  until = 1,
): Point[] {
  if (!Number.isInteger(count) || count < 2)
    throw new RangeError('At least two samples required');
  return Array.from(
    { length: count },
    (_, i) => constructBezier(points, (i / (count - 1)) * until).q,
  );
}

export function clampCoordinate(value: number): number {
  return Math.round(Math.max(-1, Math.min(5, value)) * 10) / 10;
}

export const plotX = (x: number) => 40 + ((x + 1) * 400) / 6;
export const plotY = (y: number) => 440 - ((y + 1) * 400) / 6;
export const plotPoint = (p: Point) => plotX(p.x) + ',' + plotY(p.y);
export const pointText = (p: Point) =>
  '(' + Number(p.x.toFixed(2)) + ', ' + Number(p.y.toFixed(2)) + ')';

/** A self-contained, static image; no page scripts or external resources are exported. */
export function bezierSvg(points: ControlPoints): string {
  const [a, b, c] = points;
  return (
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 520">' +
    '<title>내분을 반복해 만든 이차 베지어 곡선</title><rect width="480" height="520" fill="white"/>' +
    '<polyline points="' +
    points.map(plotPoint).join(' ') +
    '" fill="none" stroke="#98a2b3" stroke-dasharray="6 5"/>' +
    '<path d="M ' +
    plotPoint(a) +
    ' Q ' +
    plotPoint(b) +
    ' ' +
    plotPoint(c) +
    '" fill="none" stroke="#007aff" stroke-width="4"/>' +
    points
      .map(
        (p, i) =>
          '<circle cx="' +
          plotX(p.x) +
          '" cy="' +
          plotY(p.y) +
          '" r="6" fill="#111113"/><text x="' +
          plotX(p.x) +
          '" y="' +
          (plotY(p.y) - 14) +
          '" text-anchor="middle" font-family="sans-serif" font-size="16">' +
          'ABC'[i] +
          '</text>',
      )
      .join('') +
    '<text x="24" y="490" font-family="sans-serif" font-size="14">' +
    points.map((p, i) => 'ABC'[i] + pointText(p)).join(' · ') +
    '</text></svg>'
  );
}
