import type { Point, VisualScene, VisualState } from './types.ts';
import {
  fact,
  format,
  n,
  s,
  sample,
  setText,
  setValue,
  truth,
} from './shared.ts';

export const TASTES = [
  '음악',
  '게임',
  '영화',
  '독서',
  '스포츠',
  '미술',
  '여행',
  '요리',
];
export const INGREDIENTS = ['밀', '우유', '달걀', '쌀', '콩', '땅콩'];
export const PERMISSIONS = ['보기', '댓글', '업로드', '삭제'];
// 환승 정류장은 두 노선에 함께 속한다. wifi-coverage와 같은 마름모 규약을 쓴다.
const STOPS = [
  { label: '학교', color: 0, transfer: false },
  { label: '시장', color: 0, transfer: false },
  { label: '역', color: 1, transfer: true },
  { label: '공원', color: 1, transfer: true },
  { label: '도서관', color: 2, transfer: false },
];
const TRANSFERS: { point: Point; label: string }[] = [
  { point: [1, 0], label: '역' },
  { point: [3, 0], label: '공원' },
];
export const intersection = (a: string[], b: string[]) =>
  a.filter((v) => b.includes(v));
export const union = (a: string[], b: string[]) => [...new Set([...a, ...b])];
export const difference = (a: string[], b: string[]) =>
  a.filter((v) => !b.includes(v));
export function similarity(a: string[], b: string[]) {
  const total = union(a, b).length;
  return total === 0 ? null : intersection(a, b).length / total;
}
export const MENUS: Record<string, string[] | null> = {
  M1: ['밀', '우유'],
  M2: ['쌀', '콩'],
  M3: ['밀', '달걀'],
  M4: null,
};
export function clubRule(p: boolean, q: boolean, rule: string) {
  return rule === 'necessary'
    ? !q || p
    : rule === 'sufficient'
      ? !p || q
      : p === q;
}
export function passwordRule(length: boolean, number: boolean, rule: string) {
  switch (rule) {
    case 'and':
      return length && number;
    case 'or':
      return length || number;
    case 'not-and':
      return !(length && number);
    case 'neither':
      return !length && !number;
    default:
      throw new Error('알 수 없는 논리 규칙');
  }
}
export const viaDistance = (x: number) => Math.abs(x - 2) + Math.abs(x - 8);
export function revenue(discount: number, quantity: number) {
  const price = (1000 * (100 - discount)) / 100;
  return {
    price,
    revenue: price * quantity,
    boundary: 100000 / price,
    minimum: Math.floor(100000 / price) + 1,
  };
}
export function logicScene(id: string, state: VisualState): VisualScene {
  switch (id) {
    case 'russell-paradox':
      return {
        diagrams: [
          {
            kind: 'flow',
            title: 'R∈R이라고 가정',
            steps: [
              { label: '가정', value: 'R∈R' },
              { label: 'R의 원소 조건', value: 'R∉R' },
              { label: '결론', value: '가정과 모순' },
            ],
          },
          {
            kind: 'flow',
            title: 'R∉R이라고 가정',
            steps: [
              { label: '가정', value: 'R∉R' },
              { label: '조건에 맞으므로', value: 'R∈R' },
              { label: '결론', value: '가정과 모순' },
            ],
          },
        ],
        facts: [
          { label: '검토할 가정', value: 'R이 집합으로 존재한다' },
          { label: '두 경우의 결론', value: '그런 집합 R은 존재할 수 없다' },
        ],
        note: 'R이 공집합이라는 뜻이 아닙니다. 자기 자신을 원소로 갖지 않는 모든 집합을 하나의 집합으로 모을 수 있다는 가정이 모순을 만듭니다.',
      };
    case 'taste-recommendation': {
      const a = setValue(state, 'a'),
        b = setValue(state, 'b'),
        common = intersection(a, b),
        total = union(a, b),
        j = similarity(a, b);
      const operation = s(state, 'operation') as
        | 'intersection'
        | 'union'
        | 'right';
      return {
        diagrams: [
          {
            kind: 'venn',
            title: 'A와 B의 취향 벤다이어그램',
            aLabel: 'A',
            bLabel: 'B',
            a,
            b,
            universe: TASTES,
            highlight: operation,
          },
        ],
        facts: [
          fact('교집합 A∩B', setText(common)),
          fact('교집합 원소 수', common.length),
          fact('합집합 A∪B', setText(total)),
          fact('합집합 원소 수', total.length),
          fact(
            '취향 유사도',
            j === null
              ? '정의되지 않음 · 합집합이 공집합'
              : common.length + ' / ' + total.length + ' = ' + format(j),
          ),
          fact('A에게 새 후보 B−A', setText(difference(b, a))),
          fact('새 후보 수', difference(b, a).length),
        ],
        note: '추천 후보가 실제로 마음에 드는지는 별도의 문제입니다.',
      };
    }
    case 'allergy-filter': {
      const menu = s(state, 'menu'),
        ingredients = MENUS[menu],
        excluded = setValue(state, 'excluded');
      const common =
        ingredients === null ? null : intersection(ingredients, excluded);
      return {
        diagrams:
          ingredients === null
            ? [
                {
                  kind: 'cards',
                  title: 'M4의 성분 정보',
                  cards: [
                    {
                      label: '성분 표시',
                      value: '정보 없음 · 판정할 수 없음',
                      positive: false,
                    },
                  ],
                },
              ]
            : [
                {
                  kind: 'venn',
                  title: '메뉴 성분과 제외 성분',
                  aLabel: 'M',
                  bLabel: 'A',
                  a: ingredients,
                  b: excluded,
                  universe: INGREDIENTS,
                  highlight: 'intersection',
                },
              ],
        facts: [
          fact('선택 메뉴', menu),
          fact(
            '메뉴 성분 M',
            ingredients === null ? '정보 없음' : setText(ingredients),
          ),
          fact('제외 성분 A', setText(excluded)),
          fact(
            '겹치는 성분 M∩A',
            common === null ? '판정 불가' : setText(common),
          ),
          fact(
            '분류',
            common === null
              ? '정보 부족'
              : common.length
                ? '제외 성분 포함'
                : '표시 정보상 조건 충족',
          ),
        ],
        note: '가상 표시 정보로 집합을 연습합니다. 정보 없음은 공집합이 아니며, 이 결과로 실제 식품의 안전성을 판단할 수 없습니다.',
      };
    }
    case 'access-permission': {
      const need = setValue(state, 'need'),
        current = setValue(state, 'current'),
        extra = difference(current, need),
        missing = difference(need, current);
      return {
        diagrams: [
          {
            kind: 'venn',
            title: '필요 권한과 현재 권한의 차이',
            aLabel: 'N',
            bLabel: 'C',
            a: need,
            b: current,
            universe: PERMISSIONS,
            highlight: 'right',
          },
        ],
        facts: [
          fact('과잉 C−N', setText(extra)),
          fact('부족 N−C', setText(missing)),
          fact('필요 권한을 모두 포함 N⊆C', truth(missing.length === 0)),
          fact('꼭 필요한 권한만 C=N', truth(!extra.length && !missing.length)),
        ],
        note: 'N만 있는 영역은 부족한 권한, C만 있는 영역은 과한 권한입니다. 실제 폴더 설정을 변경하지 않는 가상 모형입니다.',
      };
    }
    case 'bus-transfer': {
      const stations: Point[] = [
        [0, 0],
        [1, 0],
        [2, 0],
        [3, 0],
        [4, 0],
      ];
      return {
        diagrams: [
          {
            kind: 'plot',
            title: 'A와 C는 겹치지 않고 B가 둘을 연결',
            bounds: [-3, 7, -2, 2.8],
            equal: true,
            axes: false,
            circles: [
              { center: [0, 0], radius: 1.8, label: '노선 A', color: 0 },
              { center: [2, 0], radius: 1.8, label: '노선 B', color: 1 },
              { center: [4, 0], radius: 1.8, label: '노선 C', color: 2 },
            ],
            markers: [
              { point: [-0.9, 0.5], label: '학교', color: 0 },
              { point: [-0.9, -0.5], label: '시장', color: 0 },
              ...TRANSFERS.map(({ point, label }) => ({
                point,
                label,
                color: 1,
                shape: 'diamond' as const,
              })),
              { point: [4.9, 0], label: '도서관', color: 2 },
            ],
          },
          {
            kind: 'plot',
            title: '정류장 연결: 학교 → 시장 → 역 → 공원 → 도서관',
            bounds: [-0.5, 4.5, -0.5, 0.8],
            equal: true,
            axes: false,
            lines: [
              { points: stations.slice(0, 3), label: 'A', color: 0 },
              {
                points: stations.slice(2, 4),
                label: 'B',
                color: 1,
                dashed: true,
              },
              { points: stations.slice(3), label: 'C', color: 2 },
            ],
            markers: stations.map((point, i) => ({
              point,
              label: STOPS[i].label,
              color: STOPS[i].color,
              shape: STOPS[i].transfer ? ('diamond' as const) : undefined,
            })),
          },
        ],
        facts: [
          fact('A∩B', '{역}'),
          fact('B∩C', '{공원}'),
          fact('A∩C', '∅'),
          fact('전체 정류장', '5개'),
        ],
        note: '마름모는 두 노선에 함께 속한 환승 정류장입니다. 정류장 소속 관계를 나타낸 가상 그림이며, 원 면적은 개수와 비례하지 않고 운행 시간·방향은 반영하지 않습니다.',
      };
    }
    case 'infinite-cardinality':
      return {
        diagrams: [
          {
            kind: 'mapping',
            title: '자연수와 짝수의 일대일 대응',
            left: ['1', '2', '3', '4', '…', 'n'],
            right: ['2', '4', '6', '8', '…', '2n'],
            links: [
              [0, 0],
              [1, 1],
              [2, 2],
              [3, 3],
              [5, 5],
            ],
          },
          {
            kind: 'digits',
            title: '소수 목록의 대각선 자리 바꾸기',
            rows: ['1342', '5201', '7613', '8084'],
          },
        ],
        facts: [
          fact('짝짓기 규칙', 'n ↦ 2n'),
          fact('새 자리 규칙', '대각 자리가 1이면 2, 아니면 1'),
          fact('새 소수의 앞부분', '0.2121…'),
        ],
        note: '유한한 앞부분의 시각적 예시입니다. 무한 전체에 대한 증명은 본문에서 임의의 n으로 확인하세요. 새 수는 1과 2만 사용해 소수의 중복 표현 문제를 피합니다.',
      };
    case 'ad-quantifiers':
      return {
        diagrams: [
          {
            kind: 'cards',
            title: '그림의 범위 U={1,2,3,4,5,6}',
            cards: Array.from({ length: 6 }, (_, i) => ({
              label: String(i + 1),
              value: (i + 1) % 2 ? '홀수' : '홀수가 아님 · 반례',
              positive: (i + 1) % 2 === 1,
            })),
          },
        ],
        facts: [
          fact('모든 원소가 홀수', '거짓'),
          fact('어떤 원소가 홀수가 아님', '참 · 올바른 부정'),
          fact('모든 원소가 홀수가 아님', '거짓'),
        ],
        note: '자연수 전체에 대한 “모든 자연수는 홀수”도 2라는 반례 하나로 반박할 수 있습니다. 몇 개의 참인 사례만으로 전체가 참이라고 증명할 수는 없습니다.',
      };
    case 'club-criteria': {
      const rule = s(state, 'rule'),
        cases: [boolean, boolean][] = [
          [true, true],
          [true, false],
          [false, true],
          [false, false],
        ];
      return {
        diagrams: [
          {
            kind: 'cards',
            title: 'p=면접 참여, q=선발: 네 가지 사례',
            cards: cases.map(([p, q]) => ({
              label:
                (p ? '면접 참여' : '면접 불참') + ' · ' + (q ? '선발' : '탈락'),
              value: clubRule(p, q, rule) ? '규정상 허용' : '규정 위반',
              positive: clubRule(p, q, rule),
            })),
          },
        ],
        facts: [
          fact(
            '면접은 선발의',
            rule === 'necessary'
              ? '필요조건'
              : rule === 'sufficient'
                ? '충분조건'
                : '필요충분조건',
          ),
          fact(
            '면접 참여·탈락',
            clubRule(true, false, rule) ? '허용되는 사례' : '규정 위반 사례',
          ),
        ],
        note: '조건문의 전제가 거짓인 경우 조건문은 참입니다. “허용”은 해당 규정을 위반하지 않는다는 뜻입니다.',
      };
    }
    case 'password-logic': {
      const word = s(state, 'word'),
        rule = s(state, 'rule'),
        length = word.length >= 8,
        number = /\d/.test(word),
        pass = passwordRule(length, number, rule);
      return {
        diagrams: [
          {
            kind: 'flow',
            title: '가상 문자열의 조건 판정',
            steps: [
              { label: '문자열', value: word },
              { label: 'L: 길이≥8', value: truth(length) },
              { label: 'N: 숫자 포함', value: truth(number) },
              { label: '선택한 규칙', value: pass ? '통과' : '탈락' },
            ],
          },
          {
            kind: 'cards',
            title: '같은 규칙으로 네 조건 조합 비교',
            cards: [
              [true, true],
              [true, false],
              [false, true],
              [false, false],
            ].map(([l, v]) => ({
              label: 'L ' + truth(l) + ' · N ' + truth(v),
              value: passwordRule(l, v, rule) ? '통과' : '탈락',
              positive: passwordRule(l, v, rule),
            })),
          },
        ],
        facts: [
          fact('길이', word.length),
          fact('L / N', truth(length) + ' / ' + truth(number)),
          fact('판정', pass ? '통과' : '탈락'),
        ],
        note: 'OR는 둘 다 참인 경우도 포함합니다. 실제 비밀번호 대신 정해진 가상 문자열을 사용합니다.',
      };
    }
    case 'triangle-inequality': {
      const x = n(state, 'x'),
        via = viaDistance(x);
      return {
        diagrams: [
          {
            kind: 'plot',
            title: '직행 거리와 경유 거리의 비교',
            bounds: [-2.5, 12.5, -1, 3],
            equal: true,
            axes: false,
            lines: [
              {
                points: [
                  [2, 0],
                  [8, 0],
                ],
                label: '직행',
                color: 0,
              },
              {
                points: [
                  [2, 1],
                  [x, 1],
                ],
                label: '2에서 x',
                color: 1,
              },
              {
                points: [
                  [x, 2],
                  [8, 2],
                ],
                label: 'x에서 8',
                color: 2,
                dashed: true,
              },
            ],
            markers: [
              { point: [2, 0], label: '2' },
              { point: [8, 0], label: '8' },
              { point: [x, 1], label: 'x=' + format(x), color: 1 },
            ],
          },
          {
            kind: 'plot',
            title: 'y=|x−2|+|x−8|',
            bounds: [-2, 12, 0, 16],
            xLabel: '경유점 x',
            yLabel: '경유 거리',
            lines: [
              { points: sample(viaDistance, -2, 12), label: '경유 거리' },
              {
                points: [
                  [2, 6],
                  [8, 6],
                ],
                label: '등호 구간 [2,8]',
                color: 1,
              },
            ],
            markers: [{ point: [x, via], label: '현재', color: 2 }],
          },
        ],
        facts: [
          fact('직행 거리', 6),
          fact('경유 거리', via),
          fact('추가 거리', via - 6),
          fact(
            '등호 성립',
            x >= 2 && x <= 8 ? '성립 · 2≤x≤8' : '성립하지 않음',
          ),
        ],
        note: '위의 세 줄은 같은 수직선 경로를 구분해 그린 것입니다. [2,8]에서는 되돌아갈 필요가 없습니다.',
      };
    }
    case 'price-revenue-logic': {
      const discount = n(state, 'discount'),
        quantity = n(state, 'quantity'),
        result = revenue(discount, quantity);
      return {
        diagrams: [
          {
            kind: 'bars',
            title: '할인 전후 매출',
            unit: '원',
            rows: [
              {
                label: '할인 전',
                values: [{ label: '1,000원 × 100개', value: 100000, color: 0 }],
              },
              {
                label: '할인 후',
                values: [
                  {
                    label: format(result.price) + '원 × ' + quantity + '개',
                    value: result.revenue,
                    color: 1,
                  },
                ],
              },
            ],
          },
        ],
        facts: [
          fact('새 가격', format(result.price) + '원'),
          fact('새 매출', format(result.revenue) + '원'),
          fact(
            '매출 비교',
            result.revenue === 100000
              ? '같음'
              : result.revenue > 100000
                ? '증가'
                : '감소',
          ),
          fact('같은 매출의 경계 Q', format(result.boundary, 4)),
          fact('증가하는 최소 정수 판매량', result.minimum + '개'),
        ],
        note: '유지 경계보다 더 많이 팔아야 매출이 증가합니다. 매출과 이익은 서로 다릅니다.',
      };
    }
    default:
      throw new Error('집합·명제 시각자료 누락: ' + id);
  }
}
