import type { Point, VisualState } from './types.ts';

export const EPSILON = 1e-9;
export const format = (value: number, digits = 3) =>
  Number.isFinite(value)
    ? new Intl.NumberFormat('ko-KR', { maximumFractionDigits: digits }).format(
        Math.abs(value) < 1e-10 ? 0 : value,
      )
    : '정의되지 않음';
export const pointText = ([x, y]: Point) =>
  '(' + format(x) + ', ' + format(y) + ')';
export const n = (state: VisualState, key: string) => Number(state[key]);
export const s = (state: VisualState, key: string) => String(state[key]);
export const setValue = (state: VisualState, key: string): string[] => {
  const value = state[key];
  return Array.isArray(value) ? value : [];
};
export const sample = (
  fn: (x: number) => number,
  from: number,
  to: number,
  count = 100,
): Point[] =>
  Array.from({ length: count + 1 }, (_, i): Point => {
    const x = from + ((to - from) * i) / count;
    return [x, fn(x)];
  }).filter(([x, y]) => Number.isFinite(x) && Number.isFinite(y));
export const fact = (label: string, value: string | number) => ({
  label,
  value: typeof value === 'number' ? format(value) : value,
});
export const squaredDistance = (a: Point, b: Point) =>
  (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2;
export const distance = (a: Point, b: Point) =>
  Math.sqrt(squaredDistance(a, b));
export const truth = (value: boolean) => (value ? '참' : '거짓');
export const setText = (items: string[]) =>
  items.length ? '{' + items.join(', ') + '}' : '∅';
export function niceTicks(min: number, max: number) {
  const raw = (max - min) / 4;
  const power = 10 ** Math.floor(Math.log10(raw));
  const factor = [1, 2, 2.5, 5, 10].find((v) => v * power >= raw) ?? 10;
  const step = factor * power,
    start = Math.ceil(min / step);
  return Array.from(
    { length: Math.max(0, Math.floor(max / step) - start + 1) },
    (_, i) => Number(((start + i) * step).toPrecision(12)),
  );
}
