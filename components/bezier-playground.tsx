'use client';

import { useEffect, useRef, useState, type PointerEvent } from 'react';
import { Download, Pause, Play, RotateCcw } from 'lucide-react';
import {
  BEZIER_PRESETS,
  bezierSvg,
  clampCoordinate,
  constructBezier,
  plotPoint,
  plotX,
  plotY,
  pointText,
  sampleBezier,
  type ControlPoints,
  type Point,
} from '@/lib/bezier';

export function BezierPlayground() {
  const [points, setPoints] = useState<ControlPoints>(BEZIER_PRESETS[0].points);
  const [selected, setSelected] = useState(1);
  const [t, setT] = useState(0.5);
  const [playing, setPlaying] = useState(false);
  const [showConstruction, setShowConstruction] = useState(true);
  const [showCurve, setShowCurve] = useState(false);
  const [showSamples, setShowSamples] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const graph = useRef<HTMLDivElement>(null);
  const progress = useRef(t);
  const drag = useRef<{ index: number; pointerId: number } | null>(null);
  const { d, e, q } = constructBezier(points, t);
  const [a, b, c] = points;
  const hasCollapsedSegment = [
    [a, b],
    [b, c],
    [d, e],
  ].some(([p, r]) => Math.hypot(p.x - r.x, p.y - r.y) < 1e-9);
  const current = points[selected];
  const samples = sampleBezier(points, 11);
  const curvePath =
    'M ' + plotPoint(a) + ' Q ' + plotPoint(b) + ' ' + plotPoint(c);

  useEffect(() => {
    if (!playing) return;
    let frame = 0;
    let start: number | undefined;
    const initial = progress.current;
    function tick(now: number) {
      start ??= now;
      const next = Math.min(
        1,
        Math.round((initial + (now - start) / 6000) * 100) / 100,
      );
      progress.current = next;
      setT(next);
      if (next >= 1) setPlaying(false);
      else frame = requestAnimationFrame(tick);
    }
    const stopWhenHidden = () => {
      if (document.hidden) setPlaying(false);
    };
    document.addEventListener('visibilitychange', stopWhenHidden);
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener('visibilitychange', stopWhenHidden);
    };
  }, [playing]);

  function changeT(value: number) {
    setPlaying(false);
    progress.current = value;
    setT(value);
  }
  function movePoint(index: number, value: Point) {
    setPlaying(false);
    setPoints(
      (previous) =>
        previous.map((p, i) =>
          i === index
            ? { x: clampCoordinate(value.x), y: clampCoordinate(value.y) }
            : p,
        ) as ControlPoints,
    );
  }
  function movePointer(event: PointerEvent<HTMLButtonElement>) {
    if (
      !drag.current ||
      event.pointerId !== drag.current.pointerId ||
      !graph.current
    )
      return;
    const rect = graph.current.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 480;
    const y = ((event.clientY - rect.top) / rect.height) * 480;
    movePoint(drag.current.index, {
      x: ((x - 40) * 6) / 400 - 1,
      y: ((440 - y) * 6) / 400 - 1,
    });
  }
  function reset(index = 0) {
    setPoints(BEZIER_PRESETS[index].points);
    setSelected(1);
    changeT(0.5);
    setShowCurve(false);
    setShowSamples(false);
    setShowConstruction(true);
    setSaveMessage('');
  }
  function saveDrawing() {
    try {
      const url = URL.createObjectURL(
        new Blob([bezierSvg(points)], { type: 'image/svg+xml;charset=utf-8' }),
      );
      const link = document.createElement('a');
      link.href = url;
      link.download = '나의-베지어-곡선.svg';
      document.body.appendChild(link);
      link.click();
      link.remove();
      // Keep the blob alive long enough for mobile browsers to start the download.
      setTimeout(() => URL.revokeObjectURL(url), 60000);
      setSaveMessage(
        '곡선 그림 저장을 요청했어요. 기기에 따라 다운로드 또는 미리보기로 열립니다.',
      );
    } catch {
      setSaveMessage(
        '이 브라우저에서는 저장을 시작하지 못했어요. 화면 캡처로 곡선을 남겨 주세요.',
      );
    }
  }

  return (
    <section
      id="playground"
      aria-labelledby="bezier-title"
      className="bezier-lab mb-7 scroll-mt-24 rounded-3xl border border-[#007aff]/15 bg-white p-4 sm:p-6 print:hidden"
    >
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-[#0066cc]">직접 만드는 수학</p>
          <h2
            id="bezier-title"
            className="mt-1 text-2xl font-extrabold tracking-tight"
          >
            내분으로 곡선 만들기
          </h2>
        </div>
        <button type="button" className="bezier-button" onClick={() => reset()}>
          <RotateCcw size={18} aria-hidden="true" />
          처음으로
        </button>
      </div>
      <p className="mb-4 text-base text-[#636366]">
        A·B·C를 움직이고 t를 바꿔 보세요. 두 번 내분한 점 Q가 지나간 자리에
        곡선이 남습니다.
      </p>
      <div className="grid gap-5 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <div className="min-w-0">
          <div
            ref={graph}
            className="relative aspect-square w-full rounded-2xl border border-black/10 bg-[#f8fbff]"
          >
            <svg
              viewBox="0 0 480 480"
              className="block size-full rounded-2xl"
              aria-labelledby="bezier-plot-title bezier-plot-description"
            >
              <title id="bezier-plot-title">내분점 D, E와 곡선 위의 점 Q</title>
              <desc id="bezier-plot-description">
                A{pointText(a)}, B{pointText(b)}, C{pointText(c)}. t=
                {t.toFixed(2)}에서 D{pointText(d)}, E{pointText(e)}, Q
                {pointText(q)}. 점 이동은 아래 좌표 조절기로도 가능합니다.
              </desc>
              {[-1, 0, 1, 2, 3, 4, 5].map((value) => (
                <g key={value}>
                  <path
                    d={
                      'M ' +
                      plotX(value) +
                      ' 40 V 440 M 40 ' +
                      plotY(value) +
                      ' H 440'
                    }
                    fill="none"
                    stroke={value === 0 ? '#aab5c4' : '#e0e8f2'}
                    strokeWidth={value === 0 ? 1.5 : 1}
                  />
                  <text
                    x={plotX(value)}
                    y="465"
                    textAnchor="middle"
                    fill="#636366"
                    fontSize="18"
                  >
                    {value}
                  </text>
                  <text
                    x="22"
                    y={plotY(value) + 6}
                    textAnchor="middle"
                    fill="#636366"
                    fontSize="18"
                  >
                    {value}
                  </text>
                </g>
              ))}
              <text x="455" y="465" fill="#636366" fontSize="18">
                x
              </text>
              <text x="18" y="24" fill="#636366" fontSize="18">
                y
              </text>
              {showCurve && (
                <path
                  d={curvePath}
                  fill="none"
                  stroke="#96c7ff"
                  strokeWidth="3"
                  strokeDasharray="7 6"
                />
              )}
              {showConstruction && (
                <>
                  <polyline
                    points={points.map(plotPoint).join(' ')}
                    fill="none"
                    stroke="#98a2b3"
                    strokeWidth="2"
                    strokeDasharray="6 5"
                  />
                  <line
                    x1={plotX(d.x)}
                    y1={plotY(d.y)}
                    x2={plotX(e.x)}
                    y2={plotY(e.y)}
                    stroke="#b45309"
                    strokeWidth="3"
                  />
                  {[d, e].map((p, i) => (
                    <circle
                      key={i}
                      cx={plotX(p.x)}
                      cy={plotY(p.y)}
                      r="7"
                      fill="#b45309"
                      stroke="white"
                      strokeWidth="2"
                    />
                  ))}
                </>
              )}
              <polyline
                points={sampleBezier(points, 101, t).map(plotPoint).join(' ')}
                fill="none"
                stroke="#007aff"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {showSamples &&
                samples.map((p, i) => (
                  <circle
                    key={i}
                    cx={plotX(p.x)}
                    cy={plotY(p.y)}
                    r="4"
                    fill="white"
                    stroke="#007aff"
                    strokeWidth="2"
                  />
                ))}
              <circle
                cx={plotX(q.x)}
                cy={plotY(q.y)}
                r="9"
                fill="#007aff"
                stroke="white"
                strokeWidth="3"
              />
            </svg>
            {showConstruction &&
              t > 0.03 &&
              t < 0.97 &&
              [d, e].map((p, i) => (
                <span
                  key={i}
                  className="pointer-events-none absolute rounded bg-white/90 px-1 text-sm font-bold text-[#92400e]"
                  style={{
                    left: (plotX(p.x) / 480) * 100 + '%',
                    top: (plotY(p.y) / 480) * 100 + '%',
                    transform: 'translate(-50%, -140%)',
                  }}
                >
                  {'DE'[i]}
                </span>
              ))}
            <span
              className="pointer-events-none absolute rounded bg-white/90 px-1 text-sm font-bold text-[#0066cc]"
              style={{
                left: (plotX(q.x) / 480) * 100 + '%',
                top: (plotY(q.y) / 480) * 100 + '%',
                transform: 'translate(-50%, 65%)',
              }}
            >
              Q
            </span>
            {points.map((p, index) => (
              <button
                key={index}
                type="button"
                aria-label={
                  '점 ' +
                  'ABC'[index] +
                  ' ' +
                  pointText(p) +
                  '. 방향키로 0.1씩 이동'
                }
                aria-pressed={selected === index}
                className={
                  'bezier-handle absolute flex size-11 touch-none items-center justify-center rounded-full border-2 border-white text-base font-bold text-white shadow-md ' +
                  (selected === index
                    ? 'bg-[#0066cc] ring-2 ring-[#007aff]/35'
                    : 'bg-[#3a3a3c]')
                }
                style={{
                  left: (plotX(p.x) / 480) * 100 + '%',
                  top: (plotY(p.y) / 480) * 100 + '%',
                  transform: 'translate(-50%, -50%)',
                  zIndex: selected === index ? 2 : 1,
                }}
                onClick={() => setSelected(index)}
                onPointerDown={(event) => {
                  if (event.button !== 0 || drag.current) return;
                  setSelected(index);
                  setPlaying(false);
                  drag.current = { index, pointerId: event.pointerId };
                  event.currentTarget.setPointerCapture(event.pointerId);
                }}
                onPointerMove={movePointer}
                onPointerUp={(event) => {
                  if (drag.current?.pointerId !== event.pointerId) return;
                  drag.current = null;
                  event.currentTarget.releasePointerCapture(event.pointerId);
                }}
                onPointerCancel={() => {
                  drag.current = null;
                }}
                onLostPointerCapture={() => {
                  drag.current = null;
                }}
                onKeyDown={(event) => {
                  const delta = {
                    ArrowLeft: [-0.1, 0],
                    ArrowRight: [0.1, 0],
                    ArrowUp: [0, 0.1],
                    ArrowDown: [0, -0.1],
                  }[event.key];
                  if (!delta) return;
                  event.preventDefault();
                  setSelected(index);
                  movePoint(index, { x: p.x + delta[0], y: p.y + delta[1] });
                }}
              >
                {'ABC'[index]}
              </button>
            ))}
          </div>
          <p className="mt-3 text-sm leading-6 text-[#636366]">
            색깔 점을 끌어 이동하세요. 점이 겹치거나 터치가 어렵다면 아래에서
            점을 골라 좌표를 조절할 수 있어요.
          </p>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm font-semibold">
            <span className="text-[#3a3a3c]">A·B·C 조절점</span>
            <span className="text-[#92400e]">D·E 첫 내분점</span>
            <span className="text-[#0066cc]">Q 두 번째 내분점</span>
          </div>
        </div>
        <div className="min-w-0 space-y-5">
          <fieldset className="rounded-2xl bg-[#f2f7ff] p-4">
            <legend className="px-1 text-base font-bold">
              1. 내분 비율 바꾸기
            </legend>
            <label
              htmlFor="bezier-t"
              className="flex items-center justify-between gap-3 font-semibold"
            >
              <span>매개변수 t</span>
              <output
                aria-live="off"
                className="text-2xl font-bold tabular-nums text-[#0066cc]"
              >
                {t.toFixed(2)}
              </output>
            </label>
            <input
              id="bezier-t"
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={t}
              onChange={(event) => changeT(Number(event.target.value))}
              aria-valuetext={t.toFixed(2)}
              className="bezier-range"
            />
            <div className="flex justify-between text-sm text-[#636366]">
              <span>0 · 시작 A</span>
              <span>1 · 도착 C</span>
            </div>
            <p className="mt-3 text-base font-semibold">
              내분비 {t.toFixed(2)} : {(1 - t).toFixed(2)}
            </p>
            <p className="mt-1 text-sm leading-6 text-[#636366]">
              {t === 0 || t === 1
                ? 't=0, 1에서는 내분점 대신 선분의 끝점을 선택합니다.'
                : hasCollapsedSegment
                  ? '끝점이 겹친 선분에서는 거리 비를 정의할 수 없어요. 좌표 공식으로 계산하면 겹친 그 점을 얻습니다.'
                  : 'AD:DB = BE:EC = DQ:QE. 세 선분에 같은 비율을 사용합니다.'}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                className="bezier-button bezier-primary"
                onClick={() => {
                  if (playing) {
                    setPlaying(false);
                    return;
                  }
                  if (progress.current >= 1) {
                    progress.current = 0;
                    setT(0);
                  }
                  setPlaying(true);
                }}
              >
                {playing ? (
                  <Pause size={18} aria-hidden="true" />
                ) : (
                  <Play size={18} aria-hidden="true" />
                )}
                {playing
                  ? '일시 정지'
                  : t >= 1
                    ? '다시 그리기'
                    : '자동으로 그리기'}
              </button>
              <button
                type="button"
                className="bezier-button"
                onClick={() => changeT(0)}
              >
                t = 0
              </button>
              <button
                type="button"
                className="bezier-button"
                onClick={() => changeT(0.5)}
              >
                t = 0.5
              </button>
            </div>
          </fieldset>
          <fieldset>
            <legend className="mb-2 text-base font-bold">
              2. 조절점 옮기기
            </legend>
            <div className="grid grid-cols-3 gap-2">
              {points.map((p, i) => (
                <button
                  key={i}
                  type="button"
                  aria-pressed={selected === i}
                  className={
                    'min-h-16 rounded-xl border p-2 text-center ' +
                    (selected === i
                      ? 'border-[#007aff] bg-[#eef6ff] text-[#0066cc]'
                      : 'border-black/10 text-[#636366]')
                  }
                  onClick={() => setSelected(i)}
                >
                  <span className="block text-base font-bold">{'ABC'[i]}</span>
                  <span className="block text-sm tabular-nums">
                    {pointText(p)}
                  </span>
                </button>
              ))}
            </div>
            {(['x', 'y'] as const).map((axis) => (
              <div key={axis} className="mt-3">
                <label
                  htmlFor={'bezier-' + axis}
                  className="flex justify-between text-base"
                >
                  <span>
                    {'ABC'[selected]}의 {axis}좌표
                  </span>
                  <output
                    aria-live="off"
                    className="font-semibold tabular-nums"
                  >
                    {current[axis].toFixed(1)}
                  </output>
                </label>
                <input
                  id={'bezier-' + axis}
                  className="bezier-range"
                  type="range"
                  min="-1"
                  max="5"
                  step="0.1"
                  value={current[axis]}
                  onChange={(event) =>
                    movePoint(selected, {
                      ...current,
                      [axis]: Number(event.target.value),
                    })
                  }
                />
              </div>
            ))}
          </fieldset>
        </div>
      </div>
      <div className="mt-5 flex flex-wrap gap-x-5 gap-y-1 border-t border-black/10 pt-3">
        <label className="flex min-h-11 cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={showConstruction}
            onChange={(event) => setShowConstruction(event.target.checked)}
          />
          내분 과정 보기
        </label>
        <label className="flex min-h-11 cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={showCurve}
            onChange={(event) => setShowCurve(event.target.checked)}
          />
          전체 곡선 미리 보기
        </label>
        <label className="flex min-h-11 cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={showSamples}
            onChange={(event) => setShowSamples(event.target.checked)}
          />
          0.1 간격으로 11개 점 찍기
        </label>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl bg-[#fff7ed] p-4">
          <h3 className="font-bold text-[#92400e]">
            ① 두 선분을 같은 비율로 내분
          </h3>
          <p className="mt-2">D = (1 − t)A + tB</p>
          <p>E = (1 − t)B + tC</p>
          <p className="mt-2 font-semibold tabular-nums">
            D{pointText(d)} · E{pointText(e)}
          </p>
        </div>
        <div className="rounded-2xl bg-[#eef6ff] p-4">
          <h3 className="font-bold text-[#0066cc]">
            ② D와 E 사이를 한 번 더 내분
          </h3>
          <p className="mt-2">Q = (1 − t)D + tE</p>
          <p>Q = (1 − t)²A + 2t(1 − t)B + t²C</p>
          <p className="mt-2 font-semibold tabular-nums">Q{pointText(q)}</p>
        </div>
      </div>
      <p className="mt-3 text-sm leading-6 text-[#636366]">
        좌표는 소수 둘째 자리까지 표시합니다. t를 움직여 얻은 Q의 자취가 이차
        베지어 곡선입니다. B는 방향을 조절하는 점으로, 곡선이 반드시 B를
        지나지는 않아요.
      </p>
      {showSamples && (
        <div className="mt-4 overflow-x-auto rounded-xl border border-black/10">
          <table className="w-full text-left text-base tabular-nums">
            <caption className="p-3 text-left font-semibold">
              t를 0.1씩 바꿨을 때 Q의 좌표
            </caption>
            <thead className="bg-[#f2f2f7]">
              <tr>
                <th scope="col" className="p-3">
                  t
                </th>
                <th scope="col" className="p-3">
                  x
                </th>
                <th scope="col" className="p-3">
                  y
                </th>
              </tr>
            </thead>
            <tbody>
              {samples.map((p, i) => (
                <tr key={i} className="border-t border-black/5">
                  <td className="p-3">{(i / 10).toFixed(1)}</td>
                  <td className="p-3">{Number(p.x.toFixed(2))}</td>
                  <td className="p-3">{Number(p.y.toFixed(2))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="mt-5 flex flex-wrap items-center gap-2">
        <span className="mr-1 text-sm font-semibold text-[#636366]">
          예시로 바꾸기
        </span>
        {BEZIER_PRESETS.map((preset, i) => (
          <button
            key={preset.name}
            type="button"
            className="bezier-button"
            onClick={() => reset(i)}
          >
            {preset.name}
          </button>
        ))}
        <button type="button" className="bezier-button" onClick={saveDrawing}>
          <Download size={18} aria-hidden="true" />
          곡선 그림 저장
        </button>
      </div>
      <output className="mt-2 block text-sm text-[#636366]">
        {saveMessage}
      </output>
      <div className="mt-4 rounded-2xl border border-dashed border-[#007aff]/30 p-4">
        <h3 className="font-bold">이렇게 탐구해 보세요</h3>
        <ol className="mt-2 list-decimal space-y-2 pl-5 text-base">
          <li>기본 아치에서 t = 0.5를 눌러 Q가 B와 같은 점인지 확인하세요.</li>
          <li>
            A·C는 그대로 두고 B의 y좌표만 바꿔 보세요. Q의 높이는 어떻게
            달라질까요?
          </li>
          <li>
            ‘일직선’ 예시와 나만의 배치를 비교하고, 좌표 표나 곡선 그림을 탐구
            기록에 남겨 보세요.
          </li>
        </ol>
      </div>
      <p className="mt-3 text-sm text-[#636366]">
        변경한 점은 새로고침하면 초기화됩니다. 그림 저장은 현재 세 조절점으로
        만든 전체 곡선을 SVG 파일로 내보냅니다.
      </p>
    </section>
  );
}
