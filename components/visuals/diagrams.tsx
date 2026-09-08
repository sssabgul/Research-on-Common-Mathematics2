/* oxlint-disable jsx-a11y/prefer-tag-over-role -- Labelled inline SVG needs an SVG element; an img cannot contain the diagram geometry. */
import type { Diagram, PlotDiagram, VisualScene } from '@/lib/visuals/types';
import { format, niceTicks, setText } from '@/lib/visuals/shared';

export const VISUAL_COLORS = [
  '#0066bb',
  '#b34909',
  '#783cb1',
  '#147549',
  '#686872',
];
const color = (index = 0) => VISUAL_COLORS[index % VISUAL_COLORS.length];

function Plot({ diagram, id }: { diagram: PlotDiagram; id: string }) {
  const [xmin, xmax, ymin, ymax] = diagram.bounds;
  const height = diagram.equal
    ? Math.min(460, Math.max(210, 100 + (340 * (ymax - ymin)) / (xmax - xmin)))
    : 350;
  const width = 440,
    left = 56,
    right = 20,
    top = 25,
    bottom = 42;
  const availableWidth = width - left - right,
    availableHeight = height - top - bottom;
  const sx = availableWidth / (xmax - xmin),
    sy = availableHeight / (ymax - ymin);
  const scaleX = diagram.equal ? Math.min(sx, sy) : sx,
    scaleY = diagram.equal ? Math.min(sx, sy) : sy;
  const plotWidth = (xmax - xmin) * scaleX,
    plotHeight = (ymax - ymin) * scaleY;
  const ox = left + (availableWidth - plotWidth) / 2,
    oy = top + (availableHeight - plotHeight) / 2;
  const x = (v: number) => ox + (v - xmin) * scaleX;
  const y = (v: number) => oy + (ymax - v) * scaleY;
  const point = (p: [number, number]) => x(p[0]) + ',' + y(p[1]);
  const clipId = id + '-clip',
    arrowId = id + '-arrow';
  const axes = diagram.axes !== false;
  const xTicks = niceTicks(xmin, xmax),
    yTicks = niceTicks(ymin, ymax);
  const labels: { x: number; y: number; width: number; height: number }[] = [];
  const positioned = (diagram.markers ?? []).map((m) => {
    if (!m.label) return { ...m, labelX: 0, labelY: 0 };
    const px = x(m.point[0]),
      py = y(m.point[1]),
      textWidth = m.label.length * 12 + 4;
    const candidates = [
      [px + 8, py - 12],
      [px + 8, py + 25],
      [px - textWidth - 8, py - 12],
      [px - textWidth - 8, py + 25],
    ];
    const boxes = candidates.map(([cx, cy]) => ({
      x: Math.max(5, Math.min(width - textWidth - 5, cx)),
      y: Math.max(22, Math.min(height - 10, cy)),
      width: textWidth,
      height: 20,
    }));
    const box =
      boxes.find(
        (b) =>
          !labels.some(
            (a) =>
              b.x < a.x + a.width &&
              b.x + b.width > a.x &&
              b.y < a.y + a.height &&
              b.y + b.height > a.y,
          ),
      ) ?? boxes[0];
    labels.push(box);
    return { ...m, labelX: box.x, labelY: box.y };
  });
  const legends = [
    ...(diagram.lines ?? [])
      .filter((l) => l.label)
      .map((l) => ({ label: l.label!, color: l.color, dashed: l.dashed })),
    ...(diagram.circles ?? [])
      .filter((c) => c.label)
      .map((c) => ({ label: c.label!, color: c.color, dashed: c.dashed })),
  ].filter((v, i, all) => all.findIndex((a) => a.label === v.label) === i);
  return (
    <figure className="visual-diagram">
      <figcaption>{diagram.title}</figcaption>
      <svg
        className="visual-plot"
        viewBox={'0 0 440 ' + height}
        role="img"
        aria-labelledby={id + '-title ' + id + '-desc'}
      >
        <title id={id + '-title'}>{diagram.title}</title>
        <desc id={id + '-desc'}>
          {axes
            ? '가로축 ' +
              (diagram.xLabel ?? 'x') +
              ', 세로축 ' +
              (diagram.yLabel ?? 'y') +
              '. '
            : ''}
          {(diagram.markers ?? [])
            .filter((m) => m.label)
            .map(
              (m) =>
                m.label +
                '(' +
                format(m.point[0]) +
                ', ' +
                format(m.point[1]) +
                ')',
            )
            .join('. ')}
          {diagram.equal ? ' 가로와 세로의 단위 길이가 같습니다.' : ''}
        </desc>
        <defs>
          <clipPath id={clipId}>
            <rect x={ox} y={oy} width={plotWidth} height={plotHeight} />
          </clipPath>
          <marker
            id={arrowId}
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M0 0L10 5L0 10Z" fill="#783cb1" />
          </marker>
        </defs>
        {axes &&
          xTicks.map((v) => (
            <g key={'x' + v} className="visual-grid">
              <path
                d={'M' + x(v) + ' ' + oy + 'V' + (oy + plotHeight)}
                stroke="#e1e6ed"
              />
              <text x={x(v)} y={oy + plotHeight + 26} textAnchor="middle">
                {format(v, 6)}
              </text>
            </g>
          ))}
        {axes &&
          yTicks.map((v) => (
            <g key={'y' + v} className="visual-grid">
              <path
                d={'M' + ox + ' ' + y(v) + 'H' + (ox + plotWidth)}
                stroke="#e1e6ed"
              />
              <text x={ox - 8} y={y(v) + 6} textAnchor="end">
                {format(v, 6)}
              </text>
            </g>
          ))}
        {axes && (
          <path
            d={
              'M' +
              ox +
              ' ' +
              y(Math.max(ymin, Math.min(0, ymax))) +
              'h' +
              plotWidth +
              ' M' +
              x(Math.max(xmin, Math.min(0, xmax))) +
              ' ' +
              oy +
              'v' +
              plotHeight
            }
            fill="none"
            stroke="#8c98a8"
            strokeWidth="1.5"
          />
        )}
        <g clipPath={'url(#' + clipId + ')'}>
          {diagram.circles?.map((c, i) => (
            <ellipse
              key={'c' + i}
              cx={x(c.center[0])}
              cy={y(c.center[1])}
              rx={c.radius * scaleX}
              ry={c.radius * scaleY}
              fill={color(c.color)}
              fillOpacity="0.07"
              stroke={color(c.color)}
              strokeWidth="2.5"
              strokeDasharray={c.dashed ? '8 5' : undefined}
            />
          ))}
          {diagram.lines?.map((l, i) => (
            <g key={'l' + i}>
              {!l.dots &&
                (l.closed ? (
                  <polygon
                    points={l.points.map(point).join(' ')}
                    fill={l.fill ? color(l.color) : 'none'}
                    fillOpacity="0.09"
                    stroke={color(l.color)}
                    strokeWidth="2.5"
                  />
                ) : (
                  <polyline
                    points={l.points.map(point).join(' ')}
                    fill="none"
                    stroke={color(l.color)}
                    strokeWidth="2.5"
                    strokeDasharray={l.dashed ? '8 5' : undefined}
                    markerEnd={l.arrow ? 'url(#' + arrowId + ')' : undefined}
                  />
                ))}
              {l.dots &&
                l.points.map((p, j) => (
                  <circle
                    key={j}
                    cx={x(p[0])}
                    cy={y(p[1])}
                    r="4"
                    fill={color(l.color)}
                  />
                ))}
            </g>
          ))}
          {positioned.map((m, i) =>
            m.shape === 'diamond' ? (
              <path
                key={i}
                d={
                  'M' +
                  x(m.point[0]) +
                  ' ' +
                  (y(m.point[1]) - 5) +
                  'l5 5 -5 5 -5 -5Z'
                }
                fill={color(m.color)}
                stroke={color(m.color)}
              />
            ) : (
              <circle
                key={i}
                cx={x(m.point[0])}
                cy={y(m.point[1])}
                r={m.label ? 5.5 : 4}
                fill={m.open ? 'white' : color(m.color)}
                stroke={color(m.color)}
                strokeWidth="2"
              />
            ),
          )}
        </g>
        {positioned
          .filter(
            (m) =>
              m.label &&
              m.point[0] >= xmin &&
              m.point[0] <= xmax &&
              m.point[1] >= ymin &&
              m.point[1] <= ymax,
          )
          .map((m, i) => (
            <text
              key={i}
              className="visual-point-label"
              x={m.labelX}
              y={m.labelY}
              fill={color(m.color)}
            >
              {m.label}
            </text>
          ))}
      </svg>
      {axes && (
        <p className="visual-axis-labels">
          가로: {diagram.xLabel ?? 'x'} · 세로: {diagram.yLabel ?? 'y'}
          {diagram.equal && ' · 같은 축척'}
        </p>
      )}
      {legends.length > 0 && (
        <ul className="visual-legend">
          {legends.map((l) => (
            <li key={l.label}>
              <span
                style={{
                  borderColor: color(l.color),
                  borderStyle: l.dashed ? 'dashed' : 'solid',
                }}
                aria-hidden="true"
              />
              {l.label}
            </li>
          ))}
        </ul>
      )}
    </figure>
  );
}

function Venn({
  diagram,
  id,
}: {
  diagram: Extract<Diagram, { kind: 'venn' }>;
  id: string;
}) {
  const left = diagram.a.filter((v) => !diagram.b.includes(v)),
    both = diagram.a.filter((v) => diagram.b.includes(v)),
    right = diagram.b.filter((v) => !diagram.a.includes(v));
  const outside = diagram.universe.filter(
    (v) => !diagram.a.includes(v) && !diagram.b.includes(v),
  );
  const groups = [
    { label: diagram.aLabel + '만', items: left },
    { label: '공통', items: both },
    { label: diagram.bLabel + '만', items: right },
    { label: '두 집합 밖', items: outside },
  ];
  const active = diagram.highlight;
  const selected = (i: number) =>
    active === 'union' ||
    (i === 0 && active === 'left') ||
    (i === 1 && active === 'intersection') ||
    (i === 2 && active === 'right');
  return (
    <figure className="visual-diagram visual-venn">
      <figcaption>{diagram.title}</figcaption>
      <svg
        viewBox="0 0 440 320"
        role="img"
        aria-labelledby={id + '-title ' + id + '-desc'}
      >
        <title id={id + '-title'}>{diagram.title}</title>
        <desc id={id + '-desc'}>
          {groups.map((g) => g.label + ': ' + setText(g.items)).join('. ')}
        </desc>
        <defs>
          <clipPath id={id + '-a'}>
            <circle cx="155" cy="164" r="112" />
          </clipPath>
          <clipPath id={id + '-b'}>
            <circle cx="285" cy="164" r="112" />
          </clipPath>
          <mask id={id + '-not-b'}>
            <rect width="440" height="320" fill="white" />
            <circle cx="285" cy="164" r="112" fill="black" />
          </mask>
          <mask id={id + '-not-a'}>
            <rect width="440" height="320" fill="white" />
            <circle cx="155" cy="164" r="112" fill="black" />
          </mask>
        </defs>
        <rect
          x="4"
          y="4"
          width="432"
          height="312"
          rx="14"
          fill="white"
          stroke="#a9b4c2"
        />
        <text x="18" y="30" className="visual-point-label">
          전체집합 U
        </text>
        <circle
          cx="155"
          cy="164"
          r="112"
          fill={selected(0) ? '#cbe2fc' : '#f2f6fc'}
          mask={'url(#' + id + '-not-b)'}
        />
        <circle
          cx="285"
          cy="164"
          r="112"
          fill={selected(2) ? '#ffe1be' : '#fff8ef'}
          mask={'url(#' + id + '-not-a)'}
        />
        <g clipPath={'url(#' + id + '-a)'}>
          <circle
            cx="285"
            cy="164"
            r="112"
            fill={selected(1) ? '#dbc8f1' : '#f3edf9'}
          />
        </g>
        <circle
          cx="155"
          cy="164"
          r="112"
          fill="none"
          stroke="#0066bb"
          strokeWidth={selected(0) ? 3 : 2}
        />
        <circle
          cx="285"
          cy="164"
          r="112"
          fill="none"
          stroke="#b34909"
          strokeWidth={selected(2) ? 3 : 2}
          strokeDasharray="8 4"
        />
        <text x="110" y="62" textAnchor="middle" className="visual-point-label">
          {diagram.aLabel}
        </text>
        <text x="330" y="62" textAnchor="middle" className="visual-point-label">
          {diagram.bLabel}
        </text>
        {[left, both, right].map((items, group) => (
          <g key={group}>
            {(items.length > 4
              ? [items.length + '개', '아래 목록']
              : items.length
                ? items
                : ['∅']
            ).map((v, i, all) => (
              <text
                key={v}
                x={[104, 220, 337][group]}
                y={166 + (i - (all.length - 1) / 2) * 22}
                textAnchor="middle"
                className="visual-set-word"
              >
                {v}
              </text>
            ))}
          </g>
        ))}
        <text x="220" y="301" textAnchor="middle" className="visual-set-word">
          두 집합 밖: {outside.length}개
        </text>
      </svg>
      <dl className="visual-set-results">
        {groups.map((g) => (
          <div key={g.label}>
            <dt>{g.label}</dt>
            <dd>{setText(g.items)}</dd>
          </div>
        ))}
      </dl>
      <p className="visual-note">원 면적은 원소 수의 비율을 뜻하지 않습니다.</p>
    </figure>
  );
}

function Mapping({
  diagram,
  id,
}: {
  diagram: Extract<Diagram, { kind: 'mapping' }>;
  id: string;
}) {
  const count = Math.max(diagram.left.length, diagram.right.length),
    height = count * 60 + 50;
  const y = (i: number, length: number) => 55 + i * 60 + (count - length) * 30;
  return (
    <figure className="visual-diagram">
      <figcaption>{diagram.title}</figcaption>
      <svg
        viewBox={'0 0 440 ' + height}
        role="img"
        aria-labelledby={id + '-title ' + id + '-desc'}
      >
        <title id={id + '-title'}>{diagram.title}</title>
        <desc id={id + '-desc'}>
          {diagram.links
            .map(([a, b]) => diagram.left[a] + '에서 ' + diagram.right[b])
            .join('. ')}
        </desc>
        <defs>
          <marker
            id={id + '-arrow'}
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto"
          >
            <path d="M0 0L10 5L0 10Z" fill="#0066bb" />
          </marker>
        </defs>
        {diagram.links.map(([a, b], i) => (
          <path
            key={i}
            d={
              'M145 ' +
              y(a, diagram.left.length) +
              'L290 ' +
              y(b, diagram.right.length)
            }
            fill="none"
            stroke={color(i)}
            strokeWidth="2.5"
            markerEnd={'url(#' + id + '-arrow)'}
          />
        ))}
        {[diagram.left, diagram.right].map((list, side) =>
          list.map((value, i) => (
            <g key={side + '-' + i}>
              <rect
                x={side ? 300 : 12}
                y={y(i, list.length) - 20}
                width="128"
                height="40"
                rx="14"
                fill={side ? '#fff0df' : '#e8f2ff'}
                stroke={side ? '#b34909' : '#0066bb'}
              />
              <text
                x={side ? 364 : 76}
                y={y(i, list.length) + 7}
                textAnchor="middle"
                className="visual-point-label"
              >
                {value}
              </text>
            </g>
          )),
        )}
      </svg>
      <p className="visual-note">
        {diagram.links
          .map(([a, b]) => diagram.left[a] + ' → ' + diagram.right[b])
          .join(' · ')}
      </p>
    </figure>
  );
}

function RenderDiagram({ diagram, id }: { diagram: Diagram; id: string }) {
  switch (diagram.kind) {
    case 'plot':
      return <Plot diagram={diagram} id={id} />;
    case 'venn':
      return <Venn diagram={diagram} id={id} />;
    case 'mapping':
      return <Mapping diagram={diagram} id={id} />;
    case 'flow':
      return (
        <figure className="visual-diagram">
          <figcaption>{diagram.title}</figcaption>
          <ol className="visual-flow">
            {diagram.steps.map((step, i) => (
              <li key={i}>
                <span>{step.label}</span>
                {step.shade !== undefined && (
                  <span
                    className="visual-swatch"
                    style={{
                      background:
                        'rgb(' +
                        [step.shade, step.shade, step.shade].join(',') +
                        ')',
                    }}
                    aria-hidden="true"
                  />
                )}
                <strong>{step.value}</strong>
                {i < diagram.steps.length - 1 && (
                  <span className="visual-flow-arrow" aria-hidden="true">
                    →
                  </span>
                )}
              </li>
            ))}
          </ol>
        </figure>
      );
    case 'bars': {
      const max = Math.max(
        1,
        ...diagram.rows.map((row) =>
          row.values.reduce((sum, item) => sum + item.value, 0),
        ),
      );
      return (
        <figure className="visual-diagram">
          <figcaption>{diagram.title}</figcaption>
          <div className="visual-bars">
            {diagram.rows.map((row) => (
              <div key={row.label}>
                <p>
                  <strong>{row.label}</strong>
                  <span>
                    {format(row.values.reduce((sum, v) => sum + v.value, 0))}{' '}
                    {diagram.unit}
                  </span>
                </p>
                <div className="visual-bar-track" aria-hidden="true">
                  {row.values.map((item, i) => (
                    <span
                      key={i}
                      style={{
                        width: (item.value / max) * 100 + '%',
                        background: color(item.color ?? i),
                      }}
                    />
                  ))}
                </div>
                <p className="visual-note">
                  {row.values
                    .map(
                      (item) =>
                        item.label + ' ' + format(item.value) + diagram.unit,
                    )
                    .join(' + ')}
                </p>
              </div>
            ))}
          </div>
        </figure>
      );
    }
    case 'cards':
      return (
        <figure className="visual-diagram">
          <figcaption>{diagram.title}</figcaption>
          <div className="visual-case-grid">
            {diagram.cards.map((card, i) => (
              <div
                key={i}
                className={
                  'visual-case ' +
                  (card.positive ? 'is-positive' : 'is-negative')
                }
              >
                <span>{card.label}</span>
                <strong>
                  {card.positive ? '✓ ' : '× '}
                  {card.value}
                </strong>
              </div>
            ))}
          </div>
        </figure>
      );
    case 'digits':
      return (
        <figure className="visual-diagram">
          <figcaption>{diagram.title}</figcaption>
          <div className="visual-table-wrap">
            <table className="visual-table">
              <caption>n번째 행의 n번째 자리를 바꾸기</caption>
              <thead>
                <tr>
                  <th scope="col">행 n</th>
                  {[1, 2, 3, 4].map((v) => (
                    <th key={v} scope="col">
                      {v}번째 자리
                    </th>
                  ))}
                  <th scope="col">새 자리</th>
                </tr>
              </thead>
              <tbody>
                {diagram.rows.map((row, i) => (
                  <tr key={i}>
                    <th scope="row">{i + 1}</th>
                    {row.split('').map((digit, j) => (
                      <td key={j} className={i === j ? 'visual-diagonal' : ''}>
                        {digit}
                      </td>
                    ))}
                    <td className="visual-new-digit">
                      {row[i] === '1' ? '2' : '1'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="visual-note">
            새 수의 앞부분: 0.
            {diagram.rows
              .map((row, i) => (row[i] === '1' ? '2' : '1'))
              .join('')}
            …
          </p>
        </figure>
      );
    case 'items':
      return (
        <figure className="visual-diagram">
          <figcaption>{diagram.title}</figcaption>
          <div
            className="visual-items"
            aria-label={
              '수령 ' +
              diagram.received +
              '개, 필요한 ' +
              diagram.needed +
              '개, 남는 ' +
              (diagram.received - diagram.needed) +
              '개'
            }
          >
            {Array.from({ length: diagram.received }, (_, i) => (
              <span key={i} className={i < diagram.needed ? '' : 'is-extra'}>
                {i < diagram.needed ? '필요' : '남음'}
              </span>
            ))}
            {diagram.received === 0 && <span>구매 없음</span>}
          </div>
        </figure>
      );
  }
}
export function SceneView({ scene, id }: { scene: VisualScene; id: string }) {
  return (
    <div className="visual-scene">
      <div className="visual-diagrams">
        {scene.diagrams.map((diagram, i) => (
          <RenderDiagram key={i} diagram={diagram} id={id + '-' + i} />
        ))}
      </div>
      <dl className="visual-facts" aria-live="polite" aria-atomic="true">
        {scene.facts.map((f) => (
          <div key={f.label}>
            <dt>{f.label}</dt>
            <dd>{f.value}</dd>
          </div>
        ))}
      </dl>
      {scene.table && (
        <div className="visual-table-wrap">
          <table className="visual-table">
            <caption>{scene.table.caption}</caption>
            <thead>
              <tr>
                {scene.table.headers.map((h) => (
                  <th key={h} scope="col">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {scene.table.rows.map((row, i) => (
                <tr key={i}>
                  {row.map((value, j) => (
                    <td key={j}>{value}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {scene.note && <p className="visual-note">{scene.note}</p>}
    </div>
  );
}
