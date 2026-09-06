const pre = 'https://openstax.org/books/precalculus-2e/pages/';
const physics = 'https://openstax.org/books/university-physics-';
const econ = 'https://openstax.org/books/principles-economics-3e/pages/';
const math = 'https://math.libretexts.org/Bookshelves/';
export const sources = {
  consumerChoice: {
    title: 'OpenStax · 가격·소비자 선택 참고',
    url: econ + '6-1-consumption-choices',
    note: '예산 제약과 소비자 선택의 개념을 참고합니다. 이 자료가 1+1의 심리적 효과를 직접 입증하는 것은 아니며, 할인 예제는 별도로 구성한 가상 모형입니다.',
  },
  cantor: {
    title: 'Sundstrom · 9.3 비가산 집합과 칸토어의 대각선 논법',
    url:
      math +
      'Mathematical_Logic_and_Proof/Book:_Mathematical_Reasoning__Writing_and_Proof_(Sundstrom)/09:_Finite_and_Infinite_Sets/9.03:_Uncountable_Sets',
    note: '정리 9.22의 대각선 논법을 참고하세요. 기수와 비가산성은 공통수학2의 필수 학습 범위를 넘어선 심화 내용입니다.',
  },
  coordinates: {
    title: 'OpenStax · 좌표, 거리와 원',
    url: 'https://openstax.org/books/college-algebra-2e/pages/2-1-the-rectangular-coordinate-systems-and-graphs',
    note: '거리 공식과 원의 표준형을 확인하세요. 활동의 수치는 학습용으로 구성했습니다.',
  },
  linear: {
    title: 'OpenStax · 일차함수',
    url: pre + '2-1-linear-functions',
    note: '기울기의 의미와 단위를 읽는 데 참고할 수 있습니다.',
  },
  lines: {
    title: 'OpenStax · 직선의 그래프',
    url: pre + '2-2-graphs-of-linear-functions',
    note: '평행·수직 관계와 직선의 그래프를 확인하세요.',
  },
  fitting: {
    title: 'OpenStax · 데이터의 직선 모형',
    url: pre + '2-4-fitting-linear-models-to-data',
    note: '관찰 자료를 직선으로 근사할 때의 의미를 참고하세요.',
  },
  bezier: {
    title: 'MDN · 베지어 곡선',
    url: 'https://developer.mozilla.org/en-US/docs/Glossary/Bezier_curve',
    note: '조절점과 곡선의 관계를 소개합니다. 활동은 이차 베지어 곡선을 다룹니다.',
  },
  function: {
    title: 'OpenStax · 함수와 대응',
    url: pre + '1-1-functions-and-function-notation',
    note: '입력 하나에 출력 하나가 대응한다는 조건을 확인하세요.',
  },
  composition: {
    title: 'OpenStax · 합성함수',
    url: pre + '1-4-composition-of-functions',
    note: '안쪽 함수부터 계산하며 합성의 정의역을 확인하는 예시가 있습니다.',
  },
  inverse: {
    title: 'OpenStax · 역함수',
    url: pre + '1-7-inverse-functions',
    note: '일대일 대응, 입력과 출력의 교환, 정의역 제한을 참고하세요.',
  },
  rational: {
    title: 'OpenStax · 유리함수',
    url: pre + '3-7-rational-functions',
    note: '분모가 0인 값과 점근선을 구분하는 데 참고할 수 있습니다.',
  },
  sets: {
    title: 'LibreTexts · 집합과 함수의 언어',
    url:
      math +
      'Linear_Algebra/Book%3A_Linear_Algebra_%28Schilling_Nachtergaele_and_Lankham%29/13%3A_Appendices/13.01%3A_The_Language_of_Sets_and_Functions',
    note: '집합의 연산과 포함관계 부분을 참고하세요. 대학 교재 전체를 읽을 필요는 없습니다.',
  },
  proof: {
    title: 'LibreTexts · 귀류법',
    url:
      math +
      'Mathematical_Logic_and_Proof/Book:_Mathematical_Reasoning__Writing_and_Proof_(Sundstrom)/03:_Constructing_and_Writing_Proofs_in_Mathematics/3.03:_Proof_by_Contradiction',
    note: '명제의 부정을 가정하고 모순을 도출하는 증명의 구조를 확인하세요.',
  },
  logic: {
    title: 'Carnegie Mellon · 집합, 논리와 증명 교재',
    url: 'https://www.math.cmu.edu/~cnewstea/teaching/old/teaching/15-151-N17/infdesc.pdf',
    note: 'PDF의 명제·조건·집합 부분을 참고하세요. 활동은 고1 수준으로 재구성했습니다.',
  },
  apollonius: {
    title: 'Petrunin · 거리 비와 아폴로니오스의 원',
    url:
      math +
      'Geometry/Euclidean_Plane_and_its_Relatives_(Petrunin)/10:_Inversion/10.01:_Inversion',
    note: '일정한 거리 비를 갖는 점의 자취 부분을 참고하세요. 반전 이론은 선수 지식이 아닙니다.',
  },
  revenue: {
    title: 'OpenStax · 가격과 매출',
    url: econ + '5-3-elasticity-and-pricing',
    note: '가격 변화와 총매출의 관계를 참고하세요. 탄력성 공식을 선수 지식으로 쓰지 않습니다.',
  },
  demand: {
    title: 'OpenStax · 수요, 공급과 시장 균형',
    url:
      econ +
      '3-1-demand-supply-and-equilibrium-in-markets-for-goods-and-services',
    note: '다른 조건이 같다는 가정과 가격·수량 축의 의미를 확인하세요.',
  },
  tax: {
    title: 'IRS · 구간별 과세 방식',
    url: 'https://www.irs.gov/filing/federal-income-tax-rates-and-brackets',
    note: '초과한 소득 부분에 해당 세율을 적용한다는 원리만 참고합니다. 활동의 세율은 실제 세법이 아닙니다.',
  },
  involution: {
    title: 'Wolfram MathWorld · 자기 역함수',
    url: 'https://mathworld.wolfram.com/Involution.html',
    note: '두 번 합성하면 항등함수가 되는 함수의 정의를 확인하세요.',
  },
  lens: {
    title: 'OpenStax · 얇은 렌즈',
    url: physics + 'volume-3/pages/2-4-thin-lenses',
    note: '얇은 렌즈 공식의 기호와 부호 규약을 확인하세요.',
  },
  pendulum: {
    title: 'OpenStax · 진자',
    url: physics + 'volume-1/pages/15-4-pendulums',
    note: '작은 각도에서 단진자 주기식을 적용하는 조건을 확인하세요.',
  },
};
