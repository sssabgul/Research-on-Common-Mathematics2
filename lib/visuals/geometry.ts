import type {
  Point,
  PlotDiagram,
  PlotLine,
  VisualScene,
  VisualState,
} from './types.ts';
import {
  distance,
  EPSILON,
  fact,
  format,
  n,
  pointText,
  s,
  squaredDistance,
} from './shared.ts';

export function weightedHub(aCount: number): Point {
  return [(40 - aCount) / 5, (40 - aCount) / 10];
}
export function movingPoints(t: number, delay: number): [Point, Point] {
  return [
    [t, 0],
    [4, -6 + 2 * Math.max(0, t - delay)],
  ];
}
export function circleRelation(d: number, a = 2, b = 1) {
  if (d < EPSILON && Math.abs(a - b) < EPSILON)
    return { label: '동일한 원', intersections: Infinity, overlaps: true };
  if (d > a + b + EPSILON)
    return { label: '분리', intersections: 0, overlaps: false };
  if (Math.abs(d - a - b) < EPSILON)
    return { label: '외접', intersections: 1, overlaps: true };
  if (Math.abs(d - Math.abs(a - b)) < EPSILON)
    return { label: '내접', intersections: 1, overlaps: true };
  if (d < Math.abs(a - b))
    return { label: '포함', intersections: 0, overlaps: true };
  return { label: '두 교점', intersections: 2, overlaps: true };
}
export function wifiSamples(radius: number) {
  return Array.from({ length: 63 }, (_, i) => {
    const point: Point = [i % 9, Math.floor(i / 9)];
    const count = [
      [2, 3],
      [6, 3],
    ].filter(
      (c) => squaredDistance(point, c as Point) <= radius ** 2 + EPSILON,
    ).length;
    return { point, count };
  });
}
export function apollonius(k: number) {
  return k === 1
    ? { kind: 'line' as const, x: 3 }
    : {
        kind: 'circle' as const,
        center: [(6 * k * k) / (k * k - 1), 0] as Point,
        radius: (6 * k) / Math.abs(k * k - 1),
      };
}
export function reflect([x, y]: Point, axis: string): Point {
  return axis === 'x' ? [x, -y] : axis === 'y' ? [-x, y] : [-x, -y];
}
export const translate = ([x, y]: Point, p: number, q: number): Point => [
  x + p,
  y + q,
];
export function epicenterCandidate(error: number): Point {
  return [3, (89 - (5 + error) ** 2) / 16];
}
export function fitting(slope: number) {
  const points: Point[] = [
    [0, 1],
    [1, 2],
    [2, 2.8],
  ];
  const residuals = points.map(([x, y]) => y - (slope * x + 1));
  return {
    points,
    residuals,
    squaredError: residuals.reduce((sum, r) => sum + r * r, 0),
  };
}
const graph = (
  title: string,
  bounds: PlotDiagram['bounds'],
  rest: Partial<PlotDiagram> = {},
): PlotDiagram => ({ kind: 'plot', title, bounds, equal: true, ...rest });
const line = (
  points: Point[],
  label?: string,
  color = 0,
  dashed = false,
): PlotLine => ({ points, label, color, dashed });
const polygon = (points: Point[], label: string, color = 0): PlotLine => ({
  points,
  label,
  color,
  closed: true,
  fill: true,
});
const marker = (point: Point, label: string, color = 0) => ({
  point,
  label,
  color,
});
const triangle: Point[] = [
  [0, 0],
  [2, 0],
  [1, 3],
];
const pointRows = (before: Point[], after: Point[]) =>
  before.map((p, i) => [
    String.fromCharCode(65 + i),
    pointText(p),
    pointText(after[i]),
  ]);

export function geometryScene(id: string, state: VisualState): VisualScene {
  switch (id) {
    case 'commute-hub': {
      const count = n(state, 'population'),
        p = weightedHub(count);
      return {
        diagrams: [
          graph('A·B와 인원으로 평균 낸 거점 P', [-1, 9, -2, 6], {
            lines: [
              line(
                [
                  [0, 0],
                  [8, 4],
                ],
                'A와 B 사이',
              ),
            ],
            markers: [
              marker([0, 0], 'A'),
              marker([8, 4], 'B'),
              marker(p, 'P', 1),
            ],
          }),
        ],
        facts: [
          fact('학생 수 A : B', count + '명 : ' + (40 - count) + '명'),
          fact('거점 P', pointText(p)),
          fact('내분비 AP : PB', (40 - count) / 10 + ' : ' + count / 10),
          fact(
            'AP / PB 길이',
            format(distance([0, 0], p)) + ' / ' + format(distance(p, [8, 4])),
          ),
        ],
        note: '인원 비와 거리 비의 순서는 반대입니다. 좌표의 가중평균이며, 거리 합을 최소화하는 점과는 다를 수 있습니다.',
      };
    }
    case 'game-motion': {
      const t = n(state, 't');
      return {
        diagrams: [
          graph('같은 0→8 경로를 두 줄로 비교', [-1, 9, -1, 4], {
            axes: false,
            lines: [
              line(
                [
                  [0, 3],
                  [8, 3],
                ],
                '등속 8t',
              ),
              line(
                [
                  [0, 0],
                  [8, 0],
                ],
                '가속 8t²',
                1,
              ),
            ],
            markers: [
              ...[0, 0.25, 0.5, 0.75, 1].flatMap((v) => [
                marker([8 * v, 3], '', 2),
                marker([8 * v * v, 0], '', 2),
              ]),
              marker([8 * t, 3], '등속', 0),
              marker([8 * t * t, 0], '가속', 1),
            ],
          }),
        ],
        facts: [
          fact('현재 t', t),
          fact('등속 위치 x=8t', 8 * t),
          fact('가속 위치 x=8t²', 8 * t * t),
        ],
        note: '두 줄은 같은 경로의 비교 표현입니다. 작은 점은 t를 0.25씩 늘린 위치입니다.',
      };
    }
    case 'centroid':
      return {
        diagrams: [
          graph('세 중선과 무게중심', [-1, 7, -1, 7], {
            lines: [
              polygon(
                [
                  [0, 0],
                  [6, 0],
                  [0, 6],
                ],
                '삼각형',
              ),
              line(
                [
                  [0, 0],
                  [2, 2],
                ],
                'AG · 실선',
                1,
              ),
              line(
                [
                  [2, 2],
                  [3, 3],
                ],
                'GM · 점선',
                3,
                true,
              ),
              line(
                [
                  [6, 0],
                  [0, 3],
                ],
                '다른 중선',
                2,
                true,
              ),
              line(
                [
                  [0, 6],
                  [3, 0],
                ],
                undefined,
                2,
                true,
              ),
            ],
            markers: [
              marker([0, 0], 'A'),
              marker([6, 0], 'B'),
              marker([0, 6], 'C'),
              marker([3, 3], 'M', 1),
              marker([0, 3], '중점', 2),
              marker([3, 0], '중점', 2),
              marker([2, 2], 'G', 3),
            ],
          }),
        ],
        facts: [
          fact('BC의 중점 M', '(3, 3)'),
          fact('좌표 평균 G', '(2, 2)'),
          fact('AG : GM', '2 : 1'),
        ],
        note: '이 삼각형에서의 확인입니다. 모든 삼각형에 대한 좌표 증명은 아래 본문과 연결해 읽어 보세요.',
      };
    case 'ramp-slope':
      return {
        diagrams: [6, 9].map((length) =>
          graph('수평거리 ' + length + 'm인 경사로', [-0.5, 9.5, -0.35, 1.1], {
            xLabel: '수평거리 (m)',
            yLabel: '높이 (m)',
            lines: [
              polygon(
                [
                  [0, 0],
                  [length, 0],
                  [length, 0.6],
                ],
                '경사면과 수평거리',
                length === 6 ? 0 : 1,
              ),
            ],
            markers: [marker([length, 0.6], '높이 0.6m')],
          }),
        ),
        facts: [
          fact('6m: 0.6 ÷ 6', '0.1'),
          fact('6m 경사로의 직선식', 'y = 0.1x'),
          fact('9m: 0.6 ÷ 9', '약 0.0667'),
          fact('9m 경사로의 직선식', 'y = (0.6/9)x'),
        ],
        note: '두 그림은 같은 축척입니다. 분모는 경사면 길이가 아닌 수평거리입니다.',
      };
    case 'perpendicular-bisector': {
      const x = n(state, 'x'),
        p: Point = [x, 2],
        da = squaredDistance(p, [0, 0]),
        db = squaredDistance(p, [6, 0]);
      return {
        diagrams: [
          graph('수직이등분선 x=3과 시험점', [-1, 7, -2, 6], {
            lines: [
              polygon(
                [
                  [-1, -2],
                  [3, -2],
                  [3, 6],
                  [-1, 6],
                ],
                'A 쪽',
                0,
              ),
              polygon(
                [
                  [3, -2],
                  [7, -2],
                  [7, 6],
                  [3, 6],
                ],
                'B 쪽',
                1,
              ),
              line(
                [
                  [3, -2],
                  [3, 6],
                ],
                '경계 x=3',
                2,
                true,
              ),
              line([[0, 0], p], 'PA', 0),
              line([[6, 0], p], 'PB', 1),
            ],
            markers: [
              marker([0, 0], 'A'),
              marker([6, 0], 'B', 1),
              marker(p, 'P', 3),
            ],
          }),
        ],
        facts: [
          fact('P', pointText(p)),
          fact('PA²', da),
          fact('PB²', db),
          fact(
            '거리 비교',
            Math.abs(da - db) < EPSILON
              ? '같은 거리'
              : da < db
                ? 'A가 가까움'
                : 'B가 가까움',
          ),
        ],
        note: '시험점은 y=2에서 움직입니다. 전체 경계 x=3에는 y의 제한이 없습니다.',
      };
    }
    case 'path-collision': {
      const t = n(state, 't'),
        delay = n(state, 'delay'),
        [a, b] = movingPoints(t, delay);
      return {
        diagrams: [
          graph('교차하는 두 경로와 현재 위치', [-3, 9, -7, 7], {
            lines: [
              line(
                [
                  [0, 0],
                  [6, 0],
                ],
                'A 경로',
              ),
              line(
                [
                  [4, -6],
                  [4, 6],
                ],
                'B 경로',
                1,
              ),
            ],
            markers: [
              marker([4, 0], '교점', 2),
              marker(a, 'A', 0),
              marker(b, 'B', 1),
            ],
          }),
        ],
        facts: [
          fact('현재 시각', format(t) + '초'),
          fact('A 위치', pointText(a)),
          fact('B 위치', pointText(b)),
          fact('교점 도착 시각', 'A 4초 / B ' + (3 + delay) + '초'),
          fact(
            '현재 충돌',
            distance(a, b) < EPSILON ? '같은 시각·같은 위치' : '서로 다른 위치',
          ),
        ],
        note: '크기 없는 점 물체 모형입니다. B는 출발을 기다리는 동안 (4, −6)에 머뭅니다.',
      };
    }
    case 'line-fitting': {
      const slope = n(state, 'slope'),
        result = fitting(slope);
      return {
        diagrams: [
          graph('직선과 측정점의 세로 잔차', [-0.4, 2.5, 0.3, 3.5], {
            lines: [
              line(
                [
                  [0, 1],
                  [2.3, 2.3 * slope + 1],
                ],
                '선택 직선',
              ),
              ...result.points.map((p) =>
                line([p, [p[0], slope * p[0] + 1]], undefined, 1),
              ),
            ],
            markers: result.points.map((p, i) => marker(p, 'P' + (i + 1), 1)),
          }),
        ],
        facts: [
          fact('잔차', result.residuals.map((v) => format(v)).join(', ')),
          fact('제곱오차 합', format(result.squaredError, 4)),
        ],
        note: '오차는 세로 방향으로 측정합니다. 두 후보의 비교이며 모든 직선 중 최적이라는 증명은 아닙니다.',
      };
    }
    case 'geofence': {
      const radius = n(state, 'radius'),
        classify = (squared: number) =>
          Math.abs(squared - radius ** 2) < EPSILON
            ? '경계 · 알림 포함'
            : squared < radius ** 2
              ? '내부 · 알림 포함'
              : '외부 · 알림 제외';
      return {
        diagrams: [
          graph('반경 안팎의 P와 Q', [-6, 10, -5, 11], {
            circles: [{ center: [2, 3], radius, label: '알림 범위' }],
            markers: [
              marker([2, 3], '중심'),
              marker([5, 7], 'P', 1),
              marker([2, 4], 'Q', 2),
            ],
          }),
        ],
        facts: [
          fact('반경의 제곱 r²', radius ** 2),
          fact('P: 거리²=25', classify(25)),
          fact('Q: 거리²=1', classify(1)),
        ],
        note: '경계까지 포함하는 ≤ 조건을 사용한 가상 위치입니다.',
      };
    }
    case 'epicenter': {
      const error = n(state, 'error'),
        candidate = epicenterCandidate(error),
        centers: Point[] = [
          [0, 0],
          [6, 0],
          [0, 8],
        ];
      return {
        diagrams: [
          graph('세 관측소의 거리 원', [-6, 12, -6, 14], {
            circles: centers.map((center, i) => ({
              center,
              radius: i === 2 ? 5 + error : 5,
              label: String.fromCharCode(65 + i),
              color: i,
              dashed: i === 1,
            })),
            markers: [
              ...centers.map((p, i) =>
                marker(p, String.fromCharCode(65 + i), i),
              ),
              marker(candidate, error ? '후보' : '진앙', 3),
            ],
          }),
        ],
        facts: [
          fact('차분식의 후보', pointText(candidate)),
          fact('검산 결과', error ? '공통 교점 아님' : '세 원의 공통 교점'),
        ],
        table: {
          caption: '원래 원식에 다시 대입한 잔차: 거리² − 반경²',
          headers: ['관측소', '거리²', '반경²', '잔차'],
          rows: centers.map((p, i) => {
            const d = squaredDistance(p, candidate),
              r2 = (i === 2 ? 5 + error : 5) ** 2;
            return [
              String.fromCharCode(65 + i),
              format(d, 5),
              format(r2),
              format(d - r2, 5),
            ];
          }),
        },
        note: error
          ? 'C 거리만 5.2로 바꾸면 세 원의 공통 교점이 없습니다. 식의 차를 만족해도 원식을 만족하는지 확인해야 합니다.'
          : '세 원 모두 후보점까지의 거리가 5입니다.',
      };
    }
    case 'wifi-coverage': {
      const radius = n(state, 'radius'),
        samples = wifiSamples(radius),
        covered = samples.filter((p) => p.count > 0).length,
        both = samples.filter((p) => p.count === 2).length;
      return {
        diagrams: [
          graph('8×6 교실의 정수 격자 표본', [-2.5, 10.5, -1.5, 7.5], {
            lines: [
              line(
                [
                  [0, 0],
                  [8, 0],
                  [8, 6],
                  [0, 6],
                  [0, 0],
                ],
                '교실 경계',
              ),
            ],
            circles: [
              { center: [2, 3], radius, label: '공유기 A', color: 0 },
              {
                center: [6, 3],
                radius,
                label: '공유기 B',
                color: 1,
                dashed: true,
              },
            ],
            markers: samples.map(({ point, count }) => ({
              point,
              color: count === 0 ? 4 : count === 1 ? 0 : 2,
              open: count === 0,
              shape: count === 2 ? 'diamond' : 'circle',
            })),
          }),
        ],
        facts: [
          fact('도달 표본', covered + ' / 63개'),
          fact('표본점 도달 비율', format((covered / 63) * 100, 1) + '%'),
          fact('중복 도달 / 미도달', both + ' / ' + (63 - covered) + '개'),
        ],
        note: '빈 원=미도달, 채운 원=한 공유기, 마름모=중복 도달. 표본점 비율이며 면적 비율이나 실제 전파 측정값이 아닙니다.',
      };
    }
    case 'circle-collision': {
      const d = n(state, 'd'),
        result = circleRelation(d);
      return {
        diagrams: [
          graph('반지름 2와 1인 두 원판', [-3, 6, -3, 3], {
            circles: [
              { center: [0, 0], radius: 2, label: '반지름 2', color: 0 },
              {
                center: [d, 0],
                radius: 1,
                label: '반지름 1',
                color: 1,
                dashed: true,
              },
            ],
            lines: [
              line(
                [
                  [0, 0],
                  [d, 0],
                ],
                '중심 거리',
                2,
              ),
            ],
            markers: [marker([0, 0], 'A'), marker([d, 0], 'B', 1)],
          }),
        ],
        facts: [
          fact('상태', result.label),
          fact('테두리 교점 수', String(result.intersections) + '개'),
          fact('원판 접촉·겹침', result.overlaps ? '있음' : '없음'),
          fact('중심 거리 d', d),
        ],
        note: '포함 상태에서는 테두리 교점이 없어도 두 원판은 겹칩니다.',
      };
    }
    case 'apollonius-circle': {
      const k = n(state, 'k'),
        locus = apollonius(k),
        p: Point = [(6 * k) / (1 + k), 0];
      return {
        diagrams: [
          graph('PA / PB = ' + format(k) + '인 자취', [-7, 14, -7, 7], {
            circles:
              locus.kind === 'circle'
                ? [
                    {
                      center: locus.center,
                      radius: locus.radius,
                      label: '거리 비의 자취',
                    },
                  ]
                : [],
            lines: [
              ...(locus.kind === 'line'
                ? [
                    line(
                      [
                        [3, -7],
                        [3, 7],
                      ],
                      'x=3',
                    ),
                  ]
                : []),
              line([[0, 0], p], 'PA', 1),
              line([[6, 0], p], 'PB', 2),
            ],
            markers: [
              marker([0, 0], 'A'),
              marker([6, 0], 'B'),
              marker(p, 'P', 3),
            ],
          }),
        ],
        facts: [
          fact(
            '자취',
            locus.kind === 'line'
              ? '직선 x=3'
              : '중심 ' +
                  pointText(locus.center) +
                  ', 반지름 ' +
                  format(locus.radius),
          ),
          fact('대표점 P', pointText(p)),
          fact(
            'PA / PB 검산',
            format(distance(p, [0, 0]) / distance(p, [6, 0])),
          ),
        ],
        note: 'k=1에서는 k²−1로 나누지 않고 PA=PB를 직접 풀어 수직이등분선을 얻습니다.',
      };
    }
    case 'drag-translation': {
      const p = n(state, 'p'),
        q = n(state, 'q'),
        after = triangle.map((point) => translate(point, p, q));
      return {
        diagrams: [
          graph('삼각형의 평행이동', [-5, 8, -5, 8], {
            lines: [
              polygon(triangle, '원본'),
              polygon(after, '이동 후', 1),
              ...triangle.map((point, i) => ({
                ...line([point, after[i]], undefined, 2, true),
                arrow: true,
              })),
            ],
            markers: after.map((point, i) =>
              marker(point, String.fromCharCode(65 + i) + '′', 1),
            ),
          }),
        ],
        facts: [
          fact('이동량 (p,q)', pointText([p, q])),
          fact('밑변 길이', '이동 전 2 / 이동 후 2'),
        ],
        table: {
          caption: '꼭짓점의 좌표',
          headers: ['점', '이동 전', '이동 후'],
          rows: pointRows(triangle, after),
        },
        note: '수학 좌표에서 위로 이동하면 y가 증가합니다. 화면에 그릴 때는 y방향을 변환합니다.',
      };
    }
    case 'mirror-symmetry': {
      const axis = s(state, 'axis'),
        arrow: Point[] = [
          [0.5, 1],
          [2, 1],
          [2, 0.5],
          [3.5, 2],
          [2, 3.5],
          [2, 3],
          [0.5, 3],
        ],
        after = arrow.map((p) => reflect(p, axis));
      return {
        diagrams: [
          graph('비대칭 도형의 대칭', [-5, 5, -5, 5], {
            lines: [
              polygon(arrow, '원본'),
              polygon(after, '대칭 후', 1),
              ...(axis === 'origin'
                ? []
                : [
                    line(
                      axis === 'x'
                        ? [
                            [-5, 0],
                            [5, 0],
                          ]
                        : [
                            [0, -5],
                            [0, 5],
                          ],
                      '대칭축',
                      2,
                      true,
                    ),
                  ]),
            ],
            markers: [
              marker([2, 3], 'P'),
              marker(reflect([2, 3], axis), 'P′', 1),
            ],
          }),
        ],
        facts: [
          fact('P', '(2, 3)'),
          fact('P′', pointText(reflect([2, 3], axis))),
          fact(
            '변환',
            axis === 'origin'
              ? '원점 대칭 · 180° 회전'
              : axis + '축에 대한 반사',
          ),
        ],
        note: '원점 대칭과 축에 대한 반사를 구분해 보세요.',
      };
    }
    case 'traditional-pattern': {
      const base: Point[] = [
        [0, 0],
        [1, 2],
        [2, 0],
      ];
      return {
        diagrams: [false, true].map((alternate) =>
          graph(
            alternate ? '반사와 이동을 교대로 적용' : '가로로 2씩 평행이동',
            [-0.5, 8.5, -0.5, 2.8],
            {
              lines: Array.from({ length: 4 }, (_, i) =>
                polygon(
                  base.map(
                    ([x, y]): Point => [
                      alternate && i % 2 ? -x + 2 * (i + 1) : x + 2 * i,
                      y,
                    ],
                  ),
                  (alternate && i % 2 ? '반사→' : '') +
                    '이동 ' +
                    (alternate && i % 2 ? 2 * (i + 1) : 2 * i),
                  i,
                ),
              ),
              markers: Array.from({ length: 4 }, (_, i) =>
                marker([alternate && i % 2 ? 2 * (i + 1) : 2 * i, 0], '●', i),
              ),
            },
          ),
        ),
        facts: [
          fact('기본 조각', '(0,0), (1,2), (2,0)'),
          fact('두 번째 반사 조각', '(x,y) → (4−x,y)'),
        ],
        note: '●는 원본 (0,0) 꼭짓점의 표식입니다. 삼각형 모양이 대칭이어도 표식으로 반사를 구별할 수 있습니다.',
      };
    }
    case 'transform-order': {
      const axis = s(state, 'axis'),
        p = n(state, 'p'),
        q = n(state, 'q'),
        point: Point = [1, 2],
        before: Point[] = [
          [1, 2],
          [2, 2],
          [1, 3.5],
        ];
      const first = before.map((v) => translate(reflect(v, axis), p, q)),
        second = before.map((v) => reflect(translate(v, p, q), axis));
      return {
        diagrams: [
          graph('두 변환 순서의 최종 도형', [-8, 8, -8, 8], {
            lines: [
              polygon(before, '원본', 2),
              polygon(first, '대칭→이동', 0),
              polygon(second, '이동→대칭', 1),
            ],
            markers: [
              marker(first[0], '결과 1'),
              marker(second[0], '결과 2', 1),
            ],
          }),
          {
            kind: 'flow',
            title: '대칭 → 이동',
            steps: [
              { label: 'P', value: pointText(point) },
              { label: '대칭 R(P)', value: pointText(reflect(point, axis)) },
              { label: '이동 T(R(P))', value: pointText(first[0]) },
            ],
          },
          {
            kind: 'flow',
            title: '이동 → 대칭',
            steps: [
              { label: 'P', value: pointText(point) },
              { label: '이동 T(P)', value: pointText(translate(point, p, q)) },
              { label: '대칭 R(T(P))', value: pointText(second[0]) },
            ],
          },
        ],
        facts: [
          fact(
            '결과 비교',
            distance(first[0], second[0]) < EPSILON ? '같음' : '다름',
          ),
          fact(
            '두 결과가 같은 조건',
            axis === 'y' ? '가로 이동량 p=0' : '세로 이동량 q=0',
          ),
        ],
        note: 'T∘R은 오른쪽의 대칭 R을 먼저 적용합니다.',
      };
    }
    default:
      throw new Error('도형 시각자료 누락: ' + id);
  }
}
