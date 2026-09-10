# 공통수학2 탐구실

2022 개정 교육과정 공통수학2의 소단원별 생기부 탐구 소재를 찾아보는 반응형 웹사이트입니다.
대단원 3개 · 소단원 8개 · 탐구 주제 43개와 각 주제의 상세 탐구 안내를 담고 있습니다.

소단원의 요약 카드에서 **자세히**를 누르면 예제, 4~6단계 활동, 결과 해석 질문,
확장 질문과 참고자료를 볼 수 있습니다. 설명 위에는 주제별 시각자료 41개(정적 9개 · 조작형 32개)가
바로 표시됩니다. 경제학과 연계 4개와 수학과 심화 3개가 포함됩니다.
난이도는 내부 편집 정보로만 유지하며 학생 화면에는 표시하지 않습니다.

## 로컬 실행

Node.js 22.18 이상(또는 24)에서 다음 명령을 실행합니다.
`npm run check`가 `.ts` 파일을 직접 읽기 때문에 타입 스트리핑을 지원하는 버전이 필요합니다.

```bash
npm install
npm run dev
```

| 명령                              | 하는 일                                        |
| --------------------------------- | ---------------------------------------------- |
| `npm run dev`                     | 개발 서버                                      |
| `npm run build`                   | 정적 빌드 (`dist/client`)                      |
| `npm run check`                   | 탐구 데이터 무결성 + SEO 파일 동기화 검사      |
| `npm run postbuild`               | 빌드 산출물 검사 (build 뒤 자동 실행)          |
| `npm run gen:seo`                 | `public/sitemap.xml`, `public/robots.txt` 생성 |
| `npm run lint` / `npm run format` | oxlint / oxfmt                                 |

## 구조

```
app/
  page.tsx                       홈 - 검색·필터 + 소단원 인덱스
  [unitId]/[subunitId]/page.tsx  소단원 페이지 (정적 8개)
  [unitId]/[subunitId]/[topicId]/page.tsx  주제 상세 페이지 (정적 43개)
  layout.tsx                     메타데이터, 헤더/푸터, 본문 바로가기
lib/
  curriculum.ts                  탐구 데이터와 타입
  topic-details.ts               상세 원고 조회 (정적 페이지 생성용)
  topic-visuals.ts               시각자료 41개 등록 · 초기값 · 입력 · 관찰 질문
  visuals/                       그림 모델 · 단원별 순수 계산 · 공통 숫자/눈금 처리
  details/                       단원별 상세 원고 · 타입 · 참고자료
  curriculum-utils.ts            조회 헬퍼 · 파생 통계 · 검색 인덱스
  tone.ts                        대단원 색조 (단일 진실 공급원)
  site.ts                        배포 도메인 등 상수
scripts/
  check-curriculum.mjs           데이터 무결성 검사
  check-visuals.mjs              시각자료 등록 · 기본/경계 상태 · 수학 검산
  check-export.mjs               HTML/RSC/404 · 41개 자료의 정적 렌더링 검사
  generate-seo-files.mjs         sitemap.xml / robots.txt 생성
components/
  topic-visual.tsx               상세 페이지 상단 시각자료 카드
  visuals/                      공통 그림/입력 · 단원별 클라이언트 진입점
```

소단원마다 `/{대단원}/{소단원}` 경로의 정적 페이지가 만들어집니다(예: `/geometry/circle`).
각 주제는 그 아래의 주제 id 경로에 별도 정적 HTML로 생성됩니다
(예: /functions/function/progressive-tax).
기존 소단원 주소의 주제 앵커는 해당 요약 카드로 계속 연결됩니다.
수식은 KaTeX로 빌드 시 HTML·MathML로 렌더링하며, 홈 검색에는 상세 원고를 포함하지 않습니다.

## 베지어 곡선 체험

`/geometry/section-point/bezier`의 설명 위에 인터랙티브 체험 도구가 있습니다.
A·B·C 드래그 또는 점 선택 후 좌표 슬라이더로 배치를 바꾸고,
t 슬라이더·자동 재생으로 두 단계 내분과 Q의 자취를 확인합니다.
방향키로 조절점을 0.1씩 이동할 수 있으며, 11개 표본점의 표와 전체 곡선 SVG 저장도 지원합니다.
점 배치는 서버나 브라우저 저장소에 저장하지 않으며 새로고침하면 초기화됩니다.

계산은 `lib/bezier.ts`, 화면은 `components/bezier-playground.tsx`에 있습니다.
`npm run check`는 내분·이차식의 일치, 끝점, 겹친 점, 표본과 SVG도 검사합니다.

## 주제별 그림과 탐구 활동

도형 16개, 집합·명제 10개, 함수 15개에 좌표 그래프, 벤다이어그램, 대응도,
합성 과정, 비교 막대와 수량 그림 등을 제공합니다. 슬라이더·선택 목록·체크박스를 바꾸면
그림과 계산 결과가 함께 바뀌며, **처음 값으로** 버튼으로 초기 상태를 복구할 수 있습니다.
정적 자료에는 그림을 읽고 비교하는 관찰 질문을 제공합니다.

기존 베지어 체험(`geometry/section-point/bezier`)과 짝수 제곱 증명
(`logic/propositions/even-square-proof`)에는 새 자료를 중복 추가하지 않습니다.
기존 본문, 예제 그래프 4개, 탐구 단계와 참고자료는 그대로 유지됩니다.

새 활동은 서버나 브라우저 저장소에 상태를 저장하지 않습니다. 키보드로 입력을 조절할 수 있고,
좁은 화면에서는 그림과 조절기가 세로로 쌓입니다. 인쇄할 때는 새 조절기를 숨기고 현재 그림·결과를
남깁니다. 기존 베지어 체험은 기존 규칙대로 인쇄에서 숨깁니다.

등록과 초기값은 `lib/topic-visuals.ts`, 계산은 `lib/visuals/`의 단원별 파일,
공통 화면은 `components/visuals/`에서 관리합니다. `npm run check`는 정확한 41개 경로와
제외 2개, 정적 9개/조작형 32개, 기본값·입력 경계·집합·함수 계산을 검사합니다.
`npm run build`의 postbuild는 41개 정적 HTML에도 기본 그림과 관찰 질문이 있는지 확인합니다.

## 탐구계획서 작성

모든 주제 상세 페이지의 상단과 본문 끝에 **탐구계획서 작성** 버튼이 있습니다.
버튼은 공통 Google Forms를 새 탭으로 열며 대단원·소단원, 주제 제목,
정식 상세 페이지 주소를 자동 입력합니다. 학생은 학번·이름과 탐구 내용을 작성합니다.
후속 탐구 방향만 선택 문항이며, 로그인·이메일 수집·1회 응답 제한은 사용하지 않습니다.

공개 양식 주소와 세 항목의 `entry` 식별자는 `lib/report-form.ts`에서 관리합니다.
양식을 교체하거나 해당 질문을 삭제 후 다시 만들면 Google Forms의 **양식 미리 작성**에서
새 식별자를 확인해 수정한 뒤 다시 빌드해야 합니다. `SITE_URL`이 보고서에 저장할
상세 링크의 기준이므로 로컬·미리보기 주소가 학생 보고서에 들어가지 않습니다.

Google Forms의 **응답 → Sheets에서 보기**에서 연결된 응답 파일을 엽니다.

- **설문지 응답 시트1**: 타임스탬프와 10개 문항의 원본 응답이 자동으로 누적됩니다.
- **보고서 보기**: 같은 응답을 수식으로 표시하며 한국 시간의 제출 시각을
  `yyyy-MM-dd HH:mm:ss` 형식으로 보여 줍니다. Google Forms가 새 원본 행의 날짜 서식을
  기본값으로 덮어쓰므로 표시용 탭에서 형식을 유지합니다. 지역 설정은 `ko_KR`, 시간대는
  `Asia/Seoul`입니다. A1·A2 수식과 펼쳐진 결과 셀에 직접 입력하지 마세요.
  보기 탭은 응답 19,999건까지 표시할 행이 준비되어 있으며, 그 이상이면 행을 추가합니다.

응답 스프레드시트와 전체 응답 요약은 학생에게 공유하지 않습니다. 학생 응답이나
관리자 인증정보는 사이트 코드에 저장하지 않습니다. 확인용으로 제출한 테스트 응답은
이름과 서술 답변에 **연결 확인용 테스트**라고 표시합니다.

`npm run check`는 전체 주제의 사전 입력값·한글·특수문자·설정을 검사하고,
`npm run build`의 postbuild는 각 상세 HTML에 동일한 작성 링크가 두 개 있는지 확인합니다.

## 주제를 추가·수정할 때

1. `lib/curriculum.ts`의 해당 소단원 `topics` 배열에 항목을 추가합니다.
   `id`(소단원 안에서 유일한 영문 슬러그)와 `kind`(필터 분류)를 빠뜨리지 마세요.
2. lib/details/의 해당 단원에 같은 단원/소단원/주제 키로 상세 원고를 추가합니다.
   배경, 개념 2~~4개, 예제, 활동 4~~6단계, 해석 질문 2~~3개, 확장 질문 2개,
   교과·진로 해설과 출처 1~~3개를 작성합니다.
3. `lib/topic-visuals.ts`에 전체 경로 키로 시각자료 정의를 등록하고 해당 단원의 순수 계산을
   구현합니다. 그림은 공통 모델로 반환하고 관찰 질문·텍스트 결과를 포함합니다.
   대상이나 유형을 바꾸면 `scripts/check-visuals.mjs`와 `scripts/check-export.mjs`의
   기대 목록/개수도 검토합니다. 현재 제외 두 주제는 그대로 유지합니다.
4. 주제나 소단원을 추가했다면 npm run gen:seo로 사이트맵을 갱신합니다.
5. npm run check로 원고 누락·수식 문법·주요 예제 수치·시각자료·검색·링크·사이트맵을 확인합니다.
6. npx tsc --noEmit --incremental false, npm run lint, npm run build를 실행합니다.

## Netlify 배포

저장소를 Netlify에 연결하면 `netlify.toml`의 설정에 따라 자동으로 빌드됩니다.

- Build command: `npm run build`
- Publish directory: `dist/client`
- Node version: `22.14.0`

수동 배포가 필요하면 `npm run build` 후 생성되는 `dist/client` 폴더를 Netlify Deploys 화면에
업로드합니다.

배포 주소는 `https://research-on-common-mathematics2.netlify.app` 입니다.
도메인을 바꾸면 `lib/site.ts`의 `SITE_URL`을 고치고 `npm run gen:seo`를 다시 실행하세요.
이 값은 OG 태그(카카오톡 공유 미리보기)와 sitemap.xml의 절대 URL에 쓰입니다.

> **정적 배포라 서버가 없습니다.** `dist/client` 폴더가 사이트 전부입니다. 페이지마다
> `<경로>.html`(직접 접속·새로고침용)과 `<경로>.txt`(링크를 눌러 이동할 때 App Router가
> 가져가는 RSC 페이로드)가 **둘 다** 있어야 합니다. `npm run build`가 끝나면
> `npm run postbuild`(`scripts/check-export.mjs`)가 자동으로 이를 확인하고,
> 하나라도 빠지면 빌드를 실패시킵니다. 예전에 `.txt`가 안 나와서 "자세히"를 눌러도
> 아무 일이 없는데 배포는 Published로 뜨는 사고가 있었습니다.

## 남은 과제

- OG 이미지 - 지금은 텍스트 미리보기만 나옵니다.
- Pretendard 웹폰트 호스팅 - 현재는 기기에 설치된 경우에만 적용됩니다.
- 다크 모드 - 동작하지 않던 죽은 CSS는 제거했고, 실제 구현은 하지 않았습니다.
