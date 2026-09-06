# 공통수학2 탐구실

2022 개정 교육과정 공통수학2의 소단원별 생기부 탐구 소재를 찾아보는 반응형 웹사이트입니다.
대단원 3개 · 소단원 8개 · 탐구 주제 43개와 각 주제의 상세 탐구 안내를 담고 있습니다.

소단원의 요약 카드에서 **자세히**를 누르면 예제, 4~6단계 활동, 결과 해석 질문,
확장 질문과 참고자료를 볼 수 있습니다. 경제학과 연계 4개와 수학과 심화 3개가 포함됩니다.
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
  details/                       단원별 상세 원고 · 타입 · 참고자료
  curriculum-utils.ts            조회 헬퍼 · 파생 통계 · 검색 인덱스
  tone.ts                        대단원 색조 (단일 진실 공급원)
  site.ts                        배포 도메인 등 상수
scripts/
  check-curriculum.mjs           데이터 무결성 검사
  generate-seo-files.mjs         sitemap.xml / robots.txt 생성
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

## 주제를 추가·수정할 때

1. `lib/curriculum.ts`의 해당 소단원 `topics` 배열에 항목을 추가합니다.
   `id`(소단원 안에서 유일한 영문 슬러그)와 `kind`(필터 분류)를 빠뜨리지 마세요.
2. lib/details/의 해당 단원에 같은 단원/소단원/주제 키로 상세 원고를 추가합니다.
   배경, 개념 2~~4개, 예제, 활동 4~~6단계, 해석 질문 2~~3개, 확장 질문 2개,
   교과·진로 해설과 출처 1~~3개를 작성합니다.
3. 주제나 소단원을 추가했다면 npm run gen:seo로 사이트맵을 갱신합니다.
4. npm run check로 원고 누락·수식 문법·주요 예제 수치·검색·링크·사이트맵을 확인합니다.
5. npx tsc --noEmit, npm run lint, npm run build를 실행합니다.

## Netlify 배포

저장소를 Netlify에 연결하면 `netlify.toml`의 설정에 따라 자동으로 빌드됩니다.

- Build command: `npm run build`
- Publish directory: `dist/client`
- Node version: `22.14.0`

수동 배포가 필요하면 `npm run build` 후 생성되는 `dist/client` 폴더를 Netlify Deploys 화면에
업로드합니다.

> **배포 전 확인:** `lib/site.ts`의 `SITE_URL`이 아직 임시 주소입니다.
> 실제 도메인으로 바꾼 뒤 `npm run gen:seo`를 다시 실행하세요.
> 이 값은 OG 태그(카카오톡 공유 미리보기)와 sitemap.xml의 절대 URL에 쓰입니다.

## 남은 과제

- OG 이미지 - 지금은 텍스트 미리보기만 나옵니다.
- Pretendard 웹폰트 호스팅 - 현재는 기기에 설치된 경우에만 적용됩니다.
- 다크 모드 - 동작하지 않던 죽은 CSS는 제거했고, 실제 구현은 하지 않았습니다.
