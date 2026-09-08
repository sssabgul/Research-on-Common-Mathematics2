import type {
  VisualControl,
  VisualDefinition,
  VisualState,
} from './visuals/types.ts';
import { TASTES, INGREDIENTS, PERMISSIONS } from './visuals/logic.ts';

const range = (
  id: string,
  label: string,
  min: number,
  max: number,
  step: number,
  unit = '',
  presets?: number[],
): VisualControl => ({
  kind: 'range',
  id,
  label,
  min,
  max,
  step,
  unit,
  presets,
});
const choice = (
  id: string,
  label: string,
  options: (string | number | [string | number, string])[],
): VisualControl => ({
  kind: 'choice',
  id,
  label,
  options: options.map((v) =>
    Array.isArray(v)
      ? { value: v[0], label: v[1] }
      : { value: v, label: String(v) },
  ),
});
const set = (id: string, label: string, options: string[]): VisualControl => ({
  kind: 'set',
  id,
  label,
  options,
});
const activity = (
  key: string,
  title: string,
  question: string,
  initial: VisualState,
  controls: VisualControl[],
): VisualDefinition => ({
  key,
  title,
  question,
  mode: 'interactive',
  initial,
  controls,
});
const figure = (
  key: string,
  title: string,
  question: string,
): VisualDefinition => ({
  key,
  title,
  question,
  mode: 'static',
  initial: {},
  controls: [],
});

export const EXCLUDED_VISUAL_KEYS = [
  'geometry/section-point/bezier',
  'logic/propositions/even-square-proof',
] as const;

export const topicVisuals: VisualDefinition[] = [
  activity(
    'geometry/section-point/commute-hub',
    '인원 비율에 따라 움직이는 거점',
    '학생이 많은 지역 쪽으로 거점은 얼마나 이동하나요?',
    { population: 30 },
    [
      choice('population', 'A : B 학생 수', [
        [20, '20명 : 20명'],
        [30, '30명 : 10명'],
        [10, '10명 : 30명'],
      ]),
    ],
  ),
  activity(
    'geometry/section-point/game-motion',
    '같은 시간, 서로 다른 이동 거리',
    '같은 시간 간격의 흔적 사이 거리는 어떻게 달라지나요?',
    { t: 0.5 },
    [range('t', '시간 t', 0, 1, 0.01, '', [0, 0.25, 0.5, 0.75, 1])],
  ),
  figure(
    'geometry/section-point/centroid',
    '세 중선이 만나는 한 점',
    '꼭짓점 좌표의 평균이 세 중선 위에 모두 놓이는지 확인해 보세요.',
  ),
  figure(
    'geometry/line/ramp-slope',
    '같은 높이의 두 경사로',
    '수평거리를 6m에서 9m로 늘리면 기울기는 어떻게 달라지나요?',
  ),
  activity(
    'geometry/line/perpendicular-bisector',
    '두 시설까지의 거리 비교',
    '어떤 x에서 두 거리의 제곱이 같아지나요?',
    { x: 3 },
    [range('x', '시험점 P의 x좌표 (y=2)', 0, 6, 0.1)],
  ),
  activity(
    'geometry/line/path-collision',
    '교점에 도착하는 시각',
    'B의 출발을 1초 늦추면 같은 위치에 같은 시각에 도착하나요?',
    { t: 4, delay: 0 },
    [
      range('t', '현재 시각', 0, 6, 0.1, '초', [3, 4]),
      choice('delay', 'B의 출발 지연', [
        [0, '0초'],
        [1, '1초'],
      ]),
    ],
  ),
  activity(
    'geometry/line/line-fitting',
    '측정점과 직선의 오차',
    '두 후보 중 세로 오차의 제곱합이 더 작은 직선은 무엇인가요?',
    { slope: 1 },
    [
      choice('slope', '후보 직선', [
        [1, 'y=x+1'],
        [0.9, 'y=0.9x+1'],
      ]),
    ],
  ),
  activity(
    'geometry/circle/geofence',
    '반경 안에 들어온 위치',
    '경계까지 포함하는 조건에서 P와 Q는 알림 대상인가요?',
    { radius: 5 },
    [choice('radius', '알림 반경', [3, 5, 7])],
  ),
  activity(
    'geometry/circle/epicenter',
    '세 원의 교점과 측정 오차',
    '식의 차로 얻은 후보가 원래 세 식도 만족하나요?',
    { error: 0 },
    [
      choice('error', 'C 관측소의 거리', [
        [0, '오차 없음 · 5'],
        [0.2, '오차 +0.2 · 5.2'],
      ]),
    ],
  ),
  activity(
    'geometry/circle/wifi-coverage',
    '교실의 도달·미도달 지점',
    '두 원이 많이 겹쳐도 교실 모서리까지 모두 덮이나요?',
    { radius: 3 },
    [range('radius', '공유기 반경', 2, 4, 0.1)],
  ),
  activity(
    'geometry/circle/circle-collision',
    '원판의 충돌과 테두리 교점',
    '테두리가 만나지 않아도 원판이 겹치는 경우를 찾아보세요.',
    { d: 3 },
    [range('d', '중심 사이 거리 d', 0, 4, 0.1, '', [4, 3, 2, 1, 0.5])],
  ),
  activity(
    'geometry/circle/apollonius-circle',
    '거리 비가 만드는 자취',
    '거리 비가 1일 때 자취는 왜 원이 아닌 직선이 되나요?',
    { k: 2 },
    [choice('k', '거리 비 PA / PB', [[0.5, '½'], 1, 2, 3])],
  ),
  activity(
    'geometry/transform/drag-translation',
    '모든 꼭짓점에 같은 이동량',
    '이동 전후에 변의 길이와 모양이 유지되는지 확인하세요.',
    { p: 4, q: 2 },
    [
      range('p', '가로 이동량 p', -4, 4, 0.5),
      range('q', '세로 이동량 q', -4, 4, 0.5),
    ],
  ),
  activity(
    'geometry/transform/mirror-symmetry',
    '대칭축에 따라 바뀌는 좌표',
    '어느 좌표의 부호가 바뀌는지 그림과 함께 설명해 보세요.',
    { axis: 'y' },
    [
      choice('axis', '대칭의 기준', [
        ['x', 'x축'],
        ['y', 'y축'],
        ['origin', '원점'],
      ]),
    ],
  ),
  figure(
    'geometry/transform/traditional-pattern',
    '이동과 반사로 만드는 띠',
    '두 번째 조각의 좌표와 방향 표식을 비교해 변환 규칙을 찾아보세요.',
  ),
  activity(
    'geometry/transform/transform-order',
    '순서가 다른 두 변환',
    '두 결과가 같아지려면 어떤 이동량이 0이어야 하나요?',
    { axis: 'y', p: 3, q: 0 },
    [
      choice('axis', '대칭축', [
        ['x', 'x축'],
        ['y', 'y축'],
      ]),
      range('p', '가로 이동량 p', -4, 4, 0.5),
      range('q', '세로 이동량 q', -4, 4, 0.5),
    ],
  ),
  activity(
    'logic/sets/taste-recommendation',
    '벤다이어그램으로 취향 비교',
    '공통 취향과 A에게 새로운 추천 후보는 어떻게 다른가요?',
    {
      a: ['음악', '게임', '영화'],
      b: ['게임', '영화', '독서'],
      operation: 'intersection',
    },
    [
      set('a', 'A의 취향', TASTES),
      set('b', 'B의 취향', TASTES),
      choice('operation', '강조할 영역', [
        ['intersection', '교집합 A∩B'],
        ['union', '합집합 A∪B'],
        ['right', '추천 후보 B−A'],
      ]),
    ],
  ),
  activity(
    'logic/sets/allergy-filter',
    '겹치는 성분으로 메뉴 분류',
    '제외 성분과의 교집합이 비어 있는 메뉴는 무엇인가요?',
    { menu: 'M1', excluded: ['우유', '달걀'] },
    [
      choice('menu', '가상 메뉴', ['M1', 'M2', 'M3', ['M4', 'M4 · 정보 없음']]),
      set('excluded', '제외 성분 A', INGREDIENTS),
    ],
  ),
  activity(
    'logic/sets/access-permission',
    '필요한 권한과 현재 권한',
    '부족한 권한과 과한 권한을 서로 다른 차집합으로 찾아보세요.',
    { need: ['보기', '댓글', '업로드'], current: PERMISSIONS },
    [
      set('need', '필요 권한 N', PERMISSIONS),
      set('current', '현재 권한 C', PERMISSIONS),
    ],
  ),
  figure(
    'logic/sets/bus-transfer',
    '공통 정류장으로 연결된 노선',
    'A와 C의 교집합이 비어 있어도 B를 거쳐 갈 수 있는 이유는 무엇인가요?',
  ),
  figure(
    'logic/sets/infinite-cardinality',
    '무한한 짝짓기와 대각선 자리',
    '몇 개의 화살표나 네 행의 그림을 넘어, 임의의 n에 대한 논증이 왜 필요할까요?',
  ),
  figure(
    'logic/propositions/ad-quantifiers',
    '하나의 반례와 올바른 부정',
    '“모든 자연수는 홀수이다”를 부정하려면 어떤 반례 하나면 충분할까요?',
  ),
  activity(
    'logic/propositions/club-criteria',
    '네 사례로 읽는 선발 규정',
    '면접에 참여하고도 탈락하는 사례가 허용되는 규정은 무엇인가요?',
    { rule: 'necessary' },
    [
      choice('rule', '면접 p와 선발 q의 규정', [
        ['necessary', 'q⇒p · 필요조건'],
        ['sufficient', 'p⇒q · 충분조건'],
        ['both', 'p⇔q · 필요충분조건'],
      ]),
    ],
  ),
  activity(
    'logic/propositions/password-logic',
    '연결어에 따라 달라지는 판정',
    'AND와 OR, 두 가지 부정 규칙의 결과를 비교해 보세요.',
    { word: 'abcdefgh', rule: 'and' },
    [
      choice('word', '가상 문자열', ['abcdefg1', 'abcdefgh', 'a1', 'ab']),
      choice('rule', '논리 규칙', [
        ['and', 'L∧N'],
        ['or', 'L∨N'],
        ['not-and', '¬(L∧N)'],
        ['neither', '¬L∧¬N'],
      ]),
    ],
  ),
  activity(
    'logic/propositions/triangle-inequality',
    '경유점과 전체 이동 거리',
    '직행 거리와 경유 거리가 같아지는 x의 구간을 찾아보세요.',
    { x: 5 },
    [range('x', '경유점 x', -2, 12, 0.5, '', [2, 5, 8, 10])],
  ),
  activity(
    'logic/propositions/price-revenue-logic',
    '가격·판매량·매출의 관계',
    '판매량이 늘어도 매출이 줄어드는 사례와 매출 유지 경계를 비교하세요.',
    { discount: 20, quantity: 110 },
    [
      choice('discount', '할인율', [
        [10, '10%'],
        [20, '20%'],
        [30, '30%'],
      ]),
      range('quantity', '할인 후 판매량', 50, 200, 1, '개', [110, 125, 126]),
    ],
  ),
  activity(
    'functions/function/data-key-function',
    '입력마다 출력은 몇 개일까?',
    '동명이인이 있어도 번호에서 이름으로 가는 대응은 함수인가요?',
    { mapping: 'name' },
    [
      choice('mapping', '대응 방향', [
        ['name', '번호 → 이름'],
        ['reverse', '이름 → 번호'],
        ['class', '번호 → 학급'],
      ]),
    ],
  ),
  activity(
    'functions/function/parking-fee',
    '경계에서 바뀌는 주차요금',
    '1시간과 1.01시간에서 함수값이 어떻게 바뀌나요?',
    { t: 1 },
    [range('t', '주차 시간', 0, 3, 0.01, '시간', [1, 1.01, 2, 2.01])],
  ),
  activity(
    'functions/function/discount-shipping',
    '할인과 배송비의 두 계산 순서',
    '상품가를 바꾸어도 두 결과의 차이가 같은 이유는 무엇인가요?',
    { price: 20000 },
    [range('price', '상품 가격', 0, 100000, 1000, '원')],
  ),
  activity(
    'functions/function/photo-filter',
    '밝기와 대비의 두 처리 순서',
    '같은 밝기에서 출발해도 다른 회색이 나오나요? 잘림은 언제 생기나요?',
    { x: 100 },
    [range('x', '원본 밝기', 0, 255, 1, '', [100, 240, 250])],
  ),
  activity(
    'functions/function/cipher-inverse',
    '대응 화살표를 거꾸로 읽기',
    '한 출력으로 두 글자가 모이면 원래 글자를 유일하게 복원할 수 있나요?',
    { mode: 'bijective' },
    [
      choice('mode', '치환 규칙', [
        ['bijective', '일대일 대응'],
        ['duplicate', '중복 대응'],
      ]),
    ],
  ),
  activity(
    'functions/function/inverse-demand',
    '축을 바꾸어 표현하는 균형',
    '축을 바꾸어도 가격과 수량이 나타내는 균형은 같은가요?',
    { axis: 'quantity', demand: 120 },
    [
      choice('axis', '가로축', [
        ['quantity', '수량 Q'],
        ['price', '가격 P'],
      ]),
      choice('demand', '수요 조건 Q=a−2P의 a', [120, 140]),
    ],
  ),
  activity(
    'functions/function/progressive-tax',
    '초과분에 적용하는 세율',
    '소득 99·100·101에서 세금과 세후소득을 비교해 보세요.',
    { income: 101 },
    [range('income', '가상 소득 x', 0, 200, 1, '', [99, 100, 101])],
  ),
  activity(
    'functions/function/self-inverse',
    '함수 기계를 두 번 통과하면',
    '어떤 함수에서 두 번 적용한 값이 원래 입력으로 돌아오나요?',
    { fn: 'reflection', x: 1 },
    [
      choice('fn', '함수 f(x)', [
        ['identity', 'x'],
        ['reflection', '−x+4'],
        ['shift', 'x+1'],
        ['reciprocal', '6/x'],
      ]),
      range('x', '입력 x', -4, 4, 0.5),
    ],
  ),
  activity(
    'functions/function/discount-framing',
    '필요한 개수와 실제 받는 개수',
    '수령 단가가 같아도 총지출과 남는 상품은 어떻게 달라지나요?',
    { count: 1 },
    [range('count', '필요 개수 n', 0, 10, 1, '개')],
  ),
  activity(
    'functions/rational-irrational/group-order-cost',
    '여럿이 나누는 배송비',
    '인원이 늘면 어떤 비용만 줄어들고 어떤 비용은 남나요?',
    { count: 3 },
    [range('count', '주문 인원 n', 1, 20, 1, '명', [1, 2, 3, 6])],
  ),
  activity(
    'functions/rational-irrational/average-speed',
    '같은 거리, 다른 이동 시간',
    '산술평균과 실제 평균속력이 같아지는 경우를 찾아보세요.',
    { speed: 30 },
    [range('speed', '돌아오는 속력', 10, 120, 5, 'km/h', [30, 60, 120])],
  ),
  figure(
    'functions/rational-irrational/convex-lens',
    '초점에 가까워지는 물체와 상',
    '물체가 초점에 가까워질 때 상의 거리와 크기는 어떻게 바뀌나요?',
  ),
  figure(
    'functions/rational-irrational/pendulum',
    '길이 네 배, 주기 두 배',
    '10회 왕복에 10.3초가 걸렸다면 관측 주기는 이론값과 얼마나 다른가요?',
  ),
  activity(
    'functions/rational-irrational/service-radius',
    '면적과 반경의 서로 다른 증가',
    '면적을 같은 π만큼 늘릴 때 반경 증가량은 일정한가요?',
    { k: 4 },
    [range('k', '면적 A=kπ의 k', 1, 9, 1)],
  ),
  figure(
    'functions/rational-irrational/horizon-distance',
    '접선으로 구하는 지평선 거리',
    '높이가 두 배일 때 직선 시선 거리도 두 배가 되는지 비교해 보세요.',
  ),
];
export function findTopicVisual(key: string) {
  return topicVisuals.find((visual) => visual.key === key);
}
