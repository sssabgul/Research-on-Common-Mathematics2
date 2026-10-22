import type { Point, PlotDiagram, VisualScene, VisualState } from './types.ts';
import { fact, format, n, s, sample } from './shared.ts';

export const parkingFee = (t: number) => (t <= 1 ? 2000 : t <= 2 ? 3000 : 4000);
export const clipBrightness = (x: number) => Math.min(255, Math.max(0, x));
export function filterResults(x: number) {
  const brighten = (v: number) => clipBrightness(v + 20),
    contrast = (v: number) => clipBrightness(1.5 * v);
  return {
    bright: brighten(x),
    contrast: contrast(x),
    brightThenContrast: contrast(brighten(x)),
    contrastThenBright: brighten(contrast(x)),
  };
}
export const equilibrium = (a: number) => ({
  price: (a - 20) / 5,
  quantity: 20 + (3 * (a - 20)) / 5,
});
export function tax(income: number) {
  const first = Math.min(income, 100) * 0.1,
    excess = Math.max(income - 100, 0) * 0.2;
  return { first, excess, total: first + excess, net: income - first - excess };
}
export function applyFunction(x: number, fn: string) {
  switch (fn) {
    case 'identity':
      return x;
    case 'reflection':
      return -x + 4;
    case 'shift':
      return x + 1;
    case 'reciprocal':
      return x === 0 ? NaN : 6 / x;
    default:
      throw new Error('알 수 없는 함수');
  }
}
export function purchase(count: number) {
  const bundled = 2 * Math.ceil(count / 2);
  return {
    singleCount: count,
    singleCost: 1000 * count,
    bundleCount: bundled,
    bundleCost: bundled * 1000,
    unitPrice: count ? 1000 : null,
  };
}
export const groupCost = (count: number) =>
  count > 0 ? 8000 + 6000 / count : NaN;
export const averageSpeed = (speed: number) =>
  speed > 0 ? (120 * speed) / (60 + speed) : NaN;
export const lensDistance = (u: number) => (u > 10 ? (10 * u) / (u - 10) : NaN);
export const pendulumPeriod = (length: number) =>
  length >= 0 ? 2 * Math.PI * Math.sqrt(length / 9.8) : NaN;
export function horizon(heightMetres: number) {
  const h = heightMetres / 1000,
    radius = 6371;
  return {
    exact: Math.sqrt(2 * radius * h + h * h),
    approximate: Math.sqrt(2 * radius * h),
  };
}
const graph = (
  title: string,
  bounds: PlotDiagram['bounds'],
  rest: Partial<PlotDiagram> = {},
): PlotDiagram => ({ kind: 'plot', title, bounds, ...rest });
const marker = (point: Point, label?: string, color = 0, open = false) => ({
  point,
  label,
  color,
  open,
});
const money = (value: number) => format(value) + '원';

export function functionScene(id: string, state: VisualState): VisualScene {
  switch (id) {
    case 'matrix-composition':
      return {
        diagrams: [
          {
            kind: 'flow',
            title: 'x=1에서 g를 먼저, f를 나중에 적용',
            steps: [
              { label: '입력', value: '1' },
              { label: 'g(x)=1/x', value: '1' },
              { label: 'f(x)=(2x+1)/(x+1)', value: '3/2' },
            ],
          },
        ],
        facts: [
          { label: 'f∘g에 대응하는 곱', value: 'AB의 두 행: (1,2), (1,1)' },
          { label: '합성식', value: '(x+2)/(x+1), x≠0,−1' },
        ],
        table: {
          caption: '순서에 따른 합성의 비교',
          headers: ['적용 순서', '행렬곱', 'x=1의 출력'],
          rows: [
            ['g 다음 f', 'AB', '3/2'],
            ['f 다음 g', 'BA', '2/3'],
          ],
        },
        note: '행렬곱은 합성의 식을 나타냅니다. x=0은 정리된 식에 넣을 수 있어도 원래 g의 정의역에서 제외되므로 합성에서도 제외합니다.',
      };
    case 'increasing-inverse-intersections':
      return {
        diagrams: [
          {
            kind: 'plot',
            title: 'f(x)=2x+1과 역함수 y=(x−1)/2',
            bounds: [-3, 3, -3, 3],
            equal: true,
            description:
              '증가하는 두 직선은 y=x 위의 점 (−1,−1)에서 만납니다. 일반적인 증명은 본문에서 확인합니다.',
            lines: [
              {
                label: 'f(x)=2x+1',
                points: [
                  [-2, -3],
                  [1, 3],
                ],
                color: 0,
              },
              {
                label: 'f⁻¹(x)=(x−1)/2',
                points: [
                  [-3, -2],
                  [3, 1],
                ],
                color: 1,
              },
              {
                label: 'y=x',
                points: [
                  [-3, -3],
                  [3, 3],
                ],
                color: 2,
                dashed: true,
              },
            ],
            markers: [{ point: [-1, -1], label: '(−1,−1)' }],
          },
        ],
        facts: [
          { label: '교점의 조건', value: 'f(a)=b, f(b)=a' },
          { label: '증가 조건으로 얻는 결론', value: 'a=b' },
        ],
        note: '그림은 한 가지 예입니다. 모든 증가함수에 대한 논증은 두 부등식 경우를 배제하여 완성합니다. 교점이 없거나 여러 개일 수도 있습니다.',
      };
    case 'data-key-function': {
      const mode = s(state, 'mapping'),
        reverse = mode === 'reverse';
      const left = reverse ? ['민수', '지연'] : ['101', '102', '103'];
      const right = reverse
        ? ['101', '102', '103']
        : mode === 'class'
          ? ['1반', '2반']
          : ['민수', '지연'];
      const links: [number, number][] = reverse
        ? [
            [0, 0],
            [0, 1],
            [1, 2],
          ]
        : mode === 'class'
          ? [
              [0, 0],
              [1, 1],
              [2, 0],
            ]
          : [
              [0, 0],
              [1, 0],
              [2, 1],
            ];
      return {
        diagrams: [
          {
            kind: 'mapping',
            title: reverse
              ? '이름에서 학생번호로'
              : mode === 'class'
                ? '학생번호에서 학급으로'
                : '학생번호에서 이름으로',
            left,
            right,
            links,
          },
        ],
        facts: [
          fact('함수 여부', reverse ? '함수가 아님' : '함수'),
          ...left.map((value, i) =>
            fact(value + '의 출력 개수', links.filter(([a]) => a === i).length),
          ),
        ],
        note: reverse
          ? '민수라는 하나의 입력에 101·102가 모두 대응합니다.'
          : '여러 입력이 같은 출력에 대응해도, 입력 하나에 출력이 하나씩 정해지면 함수입니다.',
      };
    }
    case 'parking-fee': {
      const t = n(state, 't'),
        fee = parkingFee(t);
      return {
        diagrams: [
          graph('학습용 3단계 주차요금', [0, 3.15, 0, 4600], {
            xLabel: '주차 시간 (시간)',
            yLabel: '요금 (원)',
            lines: [
              {
                points: [
                  [0, 2000],
                  [1, 2000],
                ],
                label: '0≤t≤1',
                color: 0,
              },
              {
                points: [
                  [1, 3000],
                  [2, 3000],
                ],
                label: '1<t≤2',
                color: 1,
              },
              {
                points: [
                  [2, 4000],
                  [3.15, 4000],
                ],
                label: 't>2',
                color: 2,
              },
            ],
            markers: [
              marker([0, 2000]),
              marker([1, 2000]),
              marker([1, 3000], undefined, 1, true),
              marker([2, 3000], undefined, 1),
              marker([2, 4000], undefined, 2, true),
              marker([t, fee], '현재', 3),
            ],
          }),
        ],
        facts: [
          fact('주차 시간', format(t, 2) + '시간'),
          fact('요금', money(fee)),
          fact('적용 구간', t <= 1 ? '0≤t≤1' : t <= 2 ? '1<t≤2' : 't>2'),
        ],
        note: '빈 점은 그 구간에서 제외, 채운 점은 포함입니다. t=0도 2,000원인 가상 규칙이며 실제 주차장 요금이 아닙니다.',
      };
    }
    case 'discount-shipping': {
      const price = n(state, 'price');
      return {
        diagrams: [
          {
            kind: 'flow',
            title: '할인 f → 배송비 g',
            steps: [
              { label: '상품가 x', value: money(price) },
              { label: '10% 할인', value: money(price * 0.9) },
              { label: '배송비 +3,000원', value: money(price * 0.9 + 3000) },
            ],
          },
          {
            kind: 'flow',
            title: '배송비 g → 할인 f',
            steps: [
              { label: '상품가 x', value: money(price) },
              { label: '배송비 +3,000원', value: money(price + 3000) },
              { label: '전체 10% 할인', value: money((price + 3000) * 0.9) },
            ],
          },
        ],
        facts: [
          fact('g(f(x))', money(price * 0.9 + 3000)),
          fact('f(g(x))', money((price + 3000) * 0.9)),
          fact('차이', '300원'),
        ],
        note: '두 결과의 차이는 배송비 3,000원의 10%입니다.',
      };
    }
    case 'photo-filter': {
      const x = n(state, 'x'),
        values = filterResults(x);
      return {
        diagrams: [
          {
            kind: 'flow',
            title: '밝기 +20 → 대비 ×1.5',
            steps: [
              { label: '원본', value: format(x), shade: x },
              {
                label: 'F(x)',
                value: format(values.bright),
                shade: values.bright,
              },
              {
                label: 'G(F(x))',
                value: format(values.brightThenContrast),
                shade: values.brightThenContrast,
              },
            ],
          },
          {
            kind: 'flow',
            title: '대비 ×1.5 → 밝기 +20',
            steps: [
              { label: '원본', value: format(x), shade: x },
              {
                label: 'G(x)',
                value: format(values.contrast),
                shade: values.contrast,
              },
              {
                label: 'F(G(x))',
                value: format(values.contrastThenBright),
                shade: values.contrastThenBright,
              },
            ],
          },
        ],
        facts: [
          fact(
            '두 최종값의 차이',
            values.brightThenContrast - values.contrastThenBright,
          ),
          fact(
            '밝기→대비 잘림',
            x + 20 > 255 || values.bright * 1.5 > 255 ? '발생' : '없음',
          ),
          fact(
            '대비→밝기 잘림',
            x * 1.5 > 255 || values.contrast + 20 > 255 ? '발생' : '없음',
          ),
        ],
        note: 'C는 매 단계의 결과를 0~255로 자릅니다. 실수값 모형이며 정수 반올림은 하지 않습니다. 240과 250에 밝기 필터를 적용하면 모두 255가 됩니다.',
      };
    }
    case 'cipher-inverse': {
      const duplicate = s(state, 'mode') === 'duplicate',
        input = ['A', 'B', 'C'],
        output = ['B', 'C', 'A'];
      const links: [number, number][] = duplicate
        ? [
            [0, 0],
            [1, 0],
            [2, 2],
          ]
        : [
            [0, 0],
            [1, 1],
            [2, 2],
          ];
      return {
        diagrams: [
          {
            kind: 'mapping',
            title: '암호화 f',
            left: input,
            right: output,
            links,
          },
          {
            kind: 'mapping',
            title: '역방향으로 가능한 원래 글자',
            left: output,
            right: input,
            links: links.map(([a, b]) => [b, a]),
          },
        ],
        facts: [
          fact('예시 원문', 'ABCA'),
          fact('암호문', duplicate ? 'BBAB' : 'BCAB'),
          fact(
            '역방향 복원',
            duplicate ? 'B의 원래 글자는 A 또는 B' : 'BCAB → ABCA',
          ),
          fact(
            '역함수',
            duplicate ? '없음 · 출력이 중복됨' : '있음 · 일대일 대응',
          ),
        ],
        note: '출력이 같은 글자들을 임의로 하나 골라 복원할 수는 없습니다. 세 글자의 가상 치환 모형입니다.',
      };
    }
    case 'inverse-demand': {
      const a = n(state, 'demand'),
        quantityAxis = s(state, 'axis') === 'quantity',
        eq = equilibrium(a);
      const lines = quantityAxis
        ? [
            {
              points: [
                [20, (a - 20) / 2],
                [a, 0],
              ] as Point[],
              label: '역수요 P=(a−Q)/2',
              color: 0,
            },
            {
              points: [
                [20, 0],
                [a, (a - 20) / 3],
              ] as Point[],
              label: '역공급 P=(Q−20)/3',
              color: 1,
            },
          ]
        : [
            {
              points: [
                [0, a],
                [a / 2, 0],
              ] as Point[],
              label: '수요 Q=a−2P',
              color: 0,
            },
            {
              points: [
                [0, 20],
                [a / 2, 20 + (3 * a) / 2],
              ] as Point[],
              label: '공급 Q=20+3P',
              color: 1,
            },
          ];
      return {
        diagrams: [
          graph(
            '수요와 공급의 균형',
            quantityAxis ? [0, 150, 0, 75] : [0, 75, 0, 250],
            {
              xLabel: quantityAxis ? '수량 Q' : '가격 P',
              yLabel: quantityAxis ? '가격 P' : '수량 Q',
              lines,
              markers: [
                marker(
                  quantityAxis
                    ? [eq.quantity, eq.price]
                    : [eq.price, eq.quantity],
                  '균형',
                  3,
                ),
              ],
            },
          ),
        ],
        facts: [
          fact('균형 가격 P', eq.price),
          fact('균형 수량 Q', eq.quantity),
          fact(
            '그래프의 균형 좌표',
            quantityAxis
              ? '(' + eq.quantity + ', ' + eq.price + ')'
              : '(' + eq.price + ', ' + eq.quantity + ')',
          ),
        ],
        note: quantityAxis
          ? '역함수의 공통 표시 구간은 20≤Q≤' +
            a +
            '입니다. 학습용 선형 시장 모형입니다.'
          : '가격과 수량의 축을 교환해도 같은 균형을 표현합니다. 학습용 선형 시장 모형입니다.',
      };
    }
    case 'progressive-tax': {
      const income = n(state, 'income'),
        result = tax(income);
      return {
        diagrams: [
          graph('소득에 따른 세후소득', [0, 200, 0, 180], {
            xLabel: '가상 소득 x',
            yLabel: '세후소득 N(x)',
            lines: [
              {
                points: [
                  [0, 0],
                  [100, 90],
                  [200, 170],
                ],
                label: 'N(x)',
              },
            ],
            markers: [marker([income, result.net], '현재', 1)],
          }),
          {
            kind: 'bars',
            title: '세금을 구성하는 두 구간',
            unit: '',
            rows: [
              {
                label: '현재 세금',
                values: [
                  { label: '100 이하분 ×10%', value: result.first, color: 0 },
                  { label: '100 초과분 ×20%', value: result.excess, color: 1 },
                ],
              },
            ],
          },
        ],
        facts: [
          fact('소득 x', income),
          fact('세금 T(x)', result.total),
          fact('세후소득 N(x)', result.net),
        ],
        note: '100을 넘는 부분에만 20%를 적용한 가상 모형입니다. 실제 세금·공제 계산이 아닙니다.',
      };
    }
    case 'self-inverse': {
      const fn = s(state, 'fn'),
        x = n(state, 'x'),
        first = applyFunction(x, fn),
        second = applyFunction(first, fn);
      const reciprocal = fn === 'reciprocal';
      const lines = reciprocal
        ? [
            {
              points: sample((v) => 6 / v, -14, -0.1),
              label: 'f(x)=6/x',
              color: 0,
            },
            { points: sample((v) => 6 / v, 0.1, 14), color: 0 },
          ]
        : [
            {
              points: sample((v) => applyFunction(v, fn), -14, 14),
              label: '선택한 f(x)',
              color: 0,
            },
          ];
      return {
        diagrams: [
          {
            kind: 'flow',
            title: '같은 함수에 두 번 넣기',
            steps: [
              { label: '입력 x', value: format(x) },
              { label: '첫 결과 f(x)', value: format(first) },
              { label: '두 번째 f(f(x))', value: format(second) },
            ],
          },
          graph('함수와 좌표를 교환한 두 점', [-14, 14, -14, 14], {
            equal: true,
            lines: [
              ...lines,
              {
                points: [
                  [-14, -14],
                  [14, 14],
                ],
                label: 'y=x',
                color: 2,
                dashed: true,
              },
              ...(reciprocal
                ? [
                    {
                      points: [
                        [0, -14],
                        [0, 14],
                      ] as Point[],
                      label: 'x=0 점근선',
                      color: 4,
                      dashed: true,
                    },
                  ]
                : []),
            ],
            markers: [
              marker([x, first], '(x,f(x))', 1),
              marker([first, x], '(f(x),x)', 3),
            ],
          }),
        ],
        facts: [
          fact(
            '현재 입력에서 돌아왔나요?',
            Math.abs(second - x) < 1e-9 ? '예' : '아니요',
          ),
          fact('정의역', reciprocal ? '0을 제외한 실수' : '실수 전체'),
        ],
        note: '몇 개 입력의 확인만으로 전체를 증명할 수는 없습니다. 본문에서 일반식을 확인하세요. 6/x는 0에서 정의되지 않습니다.',
      };
    }
    case 'discount-framing': {
      const count = n(state, 'count'),
        result = purchase(count);
      return {
        diagrams: [
          graph('필요 개수에 따른 총지출', [0, 10, 0, 11000], {
            xLabel: '필요 개수 n (정수)',
            yLabel: '총지출 (원)',
            lines: [
              {
                points: Array.from(
                  { length: 11 },
                  (_, i): Point => [i, purchase(i).singleCost],
                ),
                label: 'A · 낱개 50%',
                color: 0,
                dots: true,
              },
              {
                points: Array.from(
                  { length: 11 },
                  (_, i): Point => [i, purchase(i).bundleCost],
                ),
                label: 'B·C · 묶음',
                color: 1,
                dots: true,
              },
            ],
            markers: [
              marker([count, result.singleCost], 'A', 0),
              marker([count, result.bundleCost], 'B·C', 1),
            ],
          }),
          {
            kind: 'items',
            title: 'A · 낱개 50% 할인',
            needed: count,
            received: result.singleCount,
          },
          {
            kind: 'items',
            title: 'B · 1+1 / C · 두 개 묶음 전체 50%',
            needed: count,
            received: result.bundleCount,
          },
        ],
        facts: [
          fact('A 총지출', money(result.singleCost)),
          fact('B·C 총지출', money(result.bundleCost)),
          fact('B·C 남는 상품', result.bundleCount - count + '개'),
          fact(
            '수령 단가 A·B·C',
            result.unitPrice === null
              ? '정의되지 않음 · 구매 0개'
              : money(result.unitPrice),
          ),
        ],
        note: 'B와 C는 두 개 묶음으로만 구매하는 조건입니다. 두 번째 상품만 50% 할인하는 규칙은 다릅니다. 계산 결과와 문구에 대한 심리적 선호도는 별개입니다.',
      };
    }
    case 'group-order-cost': {
      const count = n(state, 'count'),
        delivery = 6000 / count;
      return {
        diagrams: [
          graph('인원에 따른 1인당 부담', [0, 21, 7000, 15000], {
            xLabel: '인원 n (정수)',
            yLabel: '1인당 비용 (원)',
            lines: [
              {
                points: Array.from(
                  { length: 20 },
                  (_, i): Point => [i + 1, groupCost(i + 1)],
                ),
                dots: true,
                label: '정수 인원의 비용',
              },
              {
                points: [
                  [0, 8000],
                  [21, 8000],
                ],
                label: '수평점근선 y=8,000',
                color: 2,
                dashed: true,
              },
            ],
            markers: [marker([count, groupCost(count)], '현재', 1)],
          }),
          {
            kind: 'bars',
            title: '현재 1인당 비용의 구성',
            unit: '원',
            rows: [
              {
                label: count + '명이 주문',
                values: [
                  { label: '개인 상품비', value: 8000, color: 0 },
                  { label: '배송비 몫', value: delivery, color: 1 },
                ],
              },
            ],
          },
        ],
        facts: [
          fact('배송비 몫', money(delivery)),
          fact('개인 부담', money(groupCost(count))),
        ],
        note: '배송비 6,000원과 개인 상품비 8,000원을 고정했습니다. 유한한 인원에서는 항상 8,000원보다 큽니다.',
      };
    }
    case 'average-speed': {
      const speed = n(state, 'speed'),
        result = averageSpeed(speed);
      return {
        diagrams: [
          {
            kind: 'bars',
            title: '각각 60km를 이동하는 데 걸리는 시간',
            unit: '시간',
            rows: [
              {
                label: '가는 길 · 60km/h',
                values: [{ label: '60÷60', value: 1, color: 0 }],
              },
              {
                label: '오는 길 · ' + speed + 'km/h',
                values: [{ label: '60÷' + speed, value: 60 / speed, color: 1 }],
              },
            ],
          },
          graph('왕복 평균속력 V(x)=120x/(60+x)', [0, 125, 0, 130], {
            xLabel: '돌아오는 속력 (km/h)',
            yLabel: '평균속력 (km/h)',
            lines: [
              {
                points: sample(averageSpeed, 0.1, 125),
                label: '실제 평균속력',
              },
              {
                points: [
                  [0, 120],
                  [125, 120],
                ],
                label: '수평점근선 120',
                color: 2,
                dashed: true,
              },
            ],
            markers: [marker([speed, result], '현재', 1)],
          }),
        ],
        facts: [
          fact('총 이동 시간', format(1 + 60 / speed) + '시간'),
          fact('실제 평균속력', format(result) + 'km/h'),
          fact('두 속력의 산술평균', format((60 + speed) / 2) + 'km/h'),
        ],
        note: '왕복 거리가 같은 모형입니다. 전체 120km를 총 이동 시간으로 나눕니다.',
      };
    }
    case 'convex-lens': {
      const distances = [30, 20, 15];
      return {
        diagrams: [
          ...distances.map((u) => {
            const v = lensDistance(u),
              h = -v / u;
            return graph(
              '물체 ' + u + 'cm → 상 ' + format(v) + 'cm',
              [-35, 35, -2.6, 1.8],
              {
                axes: false,
                xLabel: '렌즈 기준 거리 (cm)',
                yLabel: '상대 높이',
                lines: [
                  {
                    points: [
                      [-35, 0],
                      [35, 0],
                    ],
                    label: '광축',
                    color: 4,
                    dashed: true,
                  },
                  {
                    points: [
                      [0, -2.4],
                      [0, 1.6],
                    ],
                    label: '렌즈',
                    color: 2,
                  },
                  {
                    points: [
                      [-u, 0],
                      [-u, 1],
                    ],
                    label: '물체',
                    color: 0,
                  },
                  {
                    points: [
                      [v, 0],
                      [v, h],
                    ],
                    label: '도립 실상',
                    color: 1,
                  },
                  {
                    points: [
                      [-u, 1],
                      [0, 1],
                      [v, h],
                    ],
                    label: '평행 입사→초점',
                    color: 0,
                  },
                  {
                    points: [
                      [-u, 1],
                      [0, 0],
                      [v, h],
                    ],
                    label: '중심 통과',
                    color: 1,
                    dashed: true,
                  },
                ],
                markers: [
                  marker([-10, 0], 'F'),
                  marker([10, 0], 'F′'),
                  marker([v, h], '상', 1),
                ],
              },
            );
          }),
          graph('v=10u/(u−10), 실상 구간 u>10', [0, 40, 0, 125], {
            xLabel: '물체 거리 u (cm)',
            yLabel: '상 거리 v (cm)',
            lines: [
              { points: sample(lensDistance, 10.1, 40), label: '상의 거리' },
              {
                points: [
                  [10, 0],
                  [10, 125],
                ],
                label: 'u=10 점근선',
                color: 2,
                dashed: true,
              },
            ],
            markers: [11, 15, 20, 30].map((u) =>
              marker([u, lensDistance(u)], String(u), 1),
            ),
          }),
        ],
        facts: [
          fact('초점거리 f', '10cm'),
          fact('실상 구간', 'u>10'),
          fact('u=10', '유한한 상의 거리 없음'),
        ],
        table: {
          caption: '물체 거리와 상의 거리',
          headers: ['u (cm)', 'v (cm)', '높이 비 −v/u'],
          rows: [30, 20, 15, 11].map((u) => [
            String(u),
            format(lensDistance(u)),
            format(-lensDistance(u) / u),
          ]),
        },
        note: '광선도의 세로는 물체 높이를 1로 둔 상대 크기입니다. 가로 거리와 세로 높이의 축척은 다릅니다. u=10을 실제 “무한대 cm” 좌표로 그리지 않습니다.',
      };
    }
    case 'pendulum':
      return {
        diagrams: [
          graph('두 진자의 길이를 같은 축척으로 비교', [-0.3, 1.1, -1.2, 0.2], {
            equal: true,
            axes: false,
            lines: [
              {
                points: [
                  [0, 0],
                  [0, -0.25],
                ],
                label: 'L=0.25m',
                color: 0,
              },
              {
                points: [
                  [0.7, 0],
                  [0.7, -1],
                ],
                label: 'L=1m',
                color: 1,
              },
            ],
            markers: [
              marker([0, 0], '고정점'),
              marker([0.7, 0], '', 1),
              marker([0, -0.25], '짧은 진자'),
              marker([0.7, -1], '긴 진자', 1),
            ],
          }),
          graph('길이와 이론 주기 T=2π√(L/9.8)', [0, 1.2, 0, 2.5], {
            xLabel: '길이 L (m)',
            yLabel: '주기 T (초)',
            lines: [
              { points: sample(pendulumPeriod, 0, 1.2), label: '이론 주기' },
            ],
            markers: [
              marker([0.25, pendulumPeriod(0.25)], '0.25m'),
              marker([1, pendulumPeriod(1)], '1m', 1),
            ],
          }),
        ],
        facts: [
          fact('0.25m의 이론 주기', format(pendulumPeriod(0.25), 4) + '초'),
          fact('1m의 이론 주기', format(pendulumPeriod(1), 4) + '초'),
          fact('길이 / 주기 배수', '4배 / 2배'),
          fact('10회에 10.3초인 관측 주기', '1.03초'),
        ],
        note: 'g=9.8m/s², 작은 진폭의 이상화된 진자 근사식입니다. 이론값과 실제 측정값을 구분합니다.',
      };
    case 'service-radius': {
      const k = n(state, 'k'),
        radius = Math.sqrt(k);
      return {
        diagrams: [
          graph('기준 원과 현재 생활권', [-3.5, 3.5, -3.5, 3.5], {
            equal: true,
            xLabel: 'x (km)',
            yLabel: 'y (km)',
            circles: [
              {
                center: [0, 0],
                radius,
                label: '현재 면적 ' + k + 'π',
                color: 0,
              },
              {
                center: [0, 0],
                radius: 1,
                label: '기준 면적 π',
                color: 1,
                dashed: true,
              },
            ],
            lines: [
              {
                points: [
                  [0, 0],
                  [radius, 0],
                ],
                label: '현재 반경',
                color: 2,
              },
            ],
            markers: [marker([radius, 0], 'r', 2)],
          }),
          graph('면적 A=kπ일 때 r=√k', [0, 10, 0, 3.5], {
            xLabel: '면적 배수 k (A=kπ km²)',
            yLabel: '반경 r (km)',
            lines: [{ points: sample(Math.sqrt, 0, 10), label: 'r=√k' }],
            markers: [marker([k, radius], '현재', 1)],
          }),
        ],
        facts: [
          fact('면적 A', k + 'π km²'),
          fact('반경 r', format(radius) + 'km'),
          fact('면적 / 반경 배수', k + '배 / ' + format(radius) + '배'),
          fact(
            '다음 π만큼 증가 시 반경 증가',
            format(Math.sqrt(k + 1) - radius) + 'km',
          ),
        ],
        note: '같은 면적 증가량 π에 대한 반경 증가량은 점점 작아집니다.',
      };
    }
    case 'horizon-distance': {
      // Schematic uses R=3 and an enlarged height, preserving the tangent/right-angle geometry.
      const r = 3,
        observer: Point = [0, 4.6],
        ty = (r * r) / observer[1],
        tx = Math.sqrt(r * r - ty * ty),
        contact: Point = [tx, ty],
        result = horizon(10);
      const u: Point = [-tx / r, -ty / r],
        tangentLength = Math.hypot(observer[0] - tx, observer[1] - ty),
        v: Point = [
          (observer[0] - tx) / tangentLength,
          (observer[1] - ty) / tangentLength,
        ],
        size = 0.25;
      const angle: Point[] = [
        [tx + u[0] * size, ty + u[1] * size],
        [tx + (u[0] + v[0]) * size, ty + (u[1] + v[1]) * size],
        [tx + v[0] * size, ty + v[1] * size],
      ];
      return {
        diagrams: [
          graph(
            '지구 단면과 지평선 접선 · 실제 비율 아님',
            [-3.7, 4.2, -3.7, 5.2],
            {
              equal: true,
              axes: false,
              circles: [{ center: [0, 0], radius: r, label: '지구 단면' }],
              lines: [
                {
                  points: [[0, 0], observer],
                  label: '중심~관측점 R+h',
                  color: 0,
                },
                { points: [[0, 0], contact], label: '반지름 R', color: 1 },
                {
                  points: [observer, contact],
                  label: '직선 시선 거리 d',
                  color: 2,
                },
                { points: angle, color: 3 },
                { points: [[0, 3], observer], label: '관측 높이 h', color: 3 },
              ],
              markers: [
                marker([0, 0], '중심'),
                marker(observer, '관측점', 3),
                marker(contact, '접점', 2),
              ],
            },
          ),
          graph('높이와 지평선까지의 직선 거리', [0, 1000, 0, 120], {
            xLabel: '관측 높이 (m)',
            yLabel: '직선 거리 (km)',
            lines: [
              {
                points: sample((h) => horizon(h).exact, 0, 1000),
                label: '정확식 √(2Rh+h²)',
              },
              {
                points: sample((h) => horizon(h).approximate, 0, 1000),
                label: '근사식 √(2Rh)',
                color: 1,
                dashed: true,
              },
            ],
            markers: [1, 10, 100, 1000].map((h) =>
              marker([h, horizon(h).exact], undefined, 2),
            ),
          }),
        ],
        facts: [
          fact('지구 반지름 R', '6,371km'),
          fact('높이 10m의 정확식', format(result.exact, 6) + 'km'),
          fact('높이 10m의 근사식', format(result.approximate, 6) + 'km'),
          fact(
            '두 식의 차이',
            format((result.exact - result.approximate) * 1e6, 2) + 'mm',
          ),
        ],
        table: {
          caption: '높이별 직선 시선 거리 (계산에는 높이를 km로 변환)',
          headers: ['높이 (m)', '정확식 (km)', '근사식 (km)'],
          rows: [1, 10, 100, 1000].map((h) => [
            String(h),
            format(horizon(h).exact, 6),
            format(horizon(h).approximate, 6),
          ]),
        },
        note: '첫 그림은 이해를 위해 높이를 크게 그린 모식도입니다. 거리는 지표면의 호 길이가 아닌 직선 시선 거리이며, 두 식의 차이는 실제 관측 정확도를 뜻하지 않습니다.',
      };
    }
    default:
      throw new Error('함수 시각자료 누락: ' + id);
  }
}
