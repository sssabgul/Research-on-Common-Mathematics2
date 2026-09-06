import type { Plot } from '@/lib/details/types';

const colors = ['#0066cc', '#b04400', '#7724ac', '#167448'];
export function DetailFigure({ plot }: { plot: Plot }) {
  const { xRange, yRange } = plot;
  const x = (v: number) =>
    60 + ((v - xRange[0]) / (xRange[1] - xRange[0])) * 320;
  const y = (v: number) =>
    350 - ((v - yRange[0]) / (yRange[1] - yRange[0])) * 320;
  const ticks = [0, 0.25, 0.5, 0.75, 1];
  const label = (n: number) => Number(n.toFixed(1)).toString();
  const xAxis = y(Math.max(yRange[0], Math.min(0, yRange[1])));
  const yAxis = x(Math.max(xRange[0], Math.min(0, xRange[1])));
  return (
    <figure className="detail-figure mt-5">
      <div className="overflow-x-auto rounded-2xl border border-black/[0.06] bg-white">
        <svg
          viewBox="0 0 420 420"
          className="mx-auto block w-full min-w-[360px] max-w-[520px]"
          aria-label={plot.caption}
        >
          <title>{plot.caption}</title>
          <desc>
            가로축 {plot.xLabel}, 세로축 {plot.yLabel}.{' '}
            {plot.series
              .map(
                (line) =>
                  line.label +
                  ': ' +
                  line.points
                    .map(([px, py]) => '(' + label(px) + ', ' + label(py) + ')')
                    .join(', '),
              )
              .join('. ')}
          </desc>
          {ticks.map((t) => {
            const vx = xRange[0] + t * (xRange[1] - xRange[0]);
            const vy = yRange[0] + t * (yRange[1] - yRange[0]);
            return (
              <g key={t}>
                <path
                  d={'M' + x(vx) + ' 30V350 M60 ' + y(vy) + 'H380'}
                  stroke="#e5e5ea"
                  fill="none"
                />
                <text
                  x={x(vx)}
                  y="376"
                  textAnchor="middle"
                  fontSize="18"
                  fill="#636366"
                >
                  {label(vx)}
                </text>
                <text
                  x="49"
                  y={y(vy) + 6}
                  textAnchor="end"
                  fontSize="18"
                  fill="#636366"
                >
                  {label(vy)}
                </text>
              </g>
            );
          })}
          <path
            d={'M60 ' + xAxis + 'H380 M' + yAxis + ' 30V350'}
            stroke="#8e8e93"
            strokeWidth="1.5"
          />
          {plot.circles?.map((c) => (
            <ellipse
              key={c.label}
              cx={x(c.x)}
              cy={y(c.y)}
              rx={(c.r * 320) / (xRange[1] - xRange[0])}
              ry={(c.r * 320) / (yRange[1] - yRange[0])}
              fill="#007aff0a"
              stroke="#0066cc"
              strokeWidth="3"
            />
          ))}
          {plot.series.map((line, i) => (
            <g key={line.label} fill={colors[i % colors.length]}>
              {line.points.length > 1 && (
                <polyline
                  points={line.points
                    .map(([px, py]) => x(px) + ',' + y(py))
                    .join(' ')}
                  fill="none"
                  stroke={colors[i % colors.length]}
                  strokeWidth="3"
                  strokeDasharray={i % 2 ? '8 5' : undefined}
                />
              )}
              {line.points.map(([px, py], index) => (
                <circle key={index} cx={x(px)} cy={y(py)} r="4.5" />
              ))}
            </g>
          ))}
          <text
            x="220"
            y="409"
            textAnchor="middle"
            fontSize="19"
            fill="#3a3a3c"
          >
            {plot.xLabel}
          </text>
          <text x="60" y="20" fontSize="19" fill="#3a3a3c">
            {plot.yLabel}
          </text>
        </svg>
      </div>
      <ul className="mt-3 flex list-none flex-wrap gap-x-5 gap-y-2 text-[14px] font-semibold">
        {plot.series.map((line, i) => (
          <li key={line.label} className="flex items-center gap-2">
            <span
              className="inline-block w-5 border-t-[3px]"
              style={{
                borderColor: colors[i % colors.length],
                borderStyle: i % 2 ? 'dashed' : 'solid',
              }}
              aria-hidden="true"
            />
            {line.label}
          </li>
        ))}
      </ul>
      <figcaption className="mt-2 text-[14px] leading-6 text-[#636366]">
        {plot.caption}
      </figcaption>
    </figure>
  );
}
