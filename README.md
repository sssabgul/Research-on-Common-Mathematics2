# 공통수학2 탐구실

2022 개정 교육과정 공통수학2의 소단원별 생기부 탐구 소재를 찾아보는 반응형 웹사이트입니다.
대단원 3개 · 소단원 8개 · 탐구 주제 36개를 담고 있습니다.

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
  layout.tsx                     메타데이터, 헤더/푸터, 본문 바로가기
lib/
  curriculum.ts                  탐구 데이터와 타입
  curriculum-utils.ts            조회 헬퍼 · 파생 통계 · 검색 인덱스
  tone.ts                        대단원 색조 (단일 진실 공급원)
  site.ts                        배포 도메인 등 상수
scripts/
  check-curriculum.mjs           데이터 무결성 검사
  generate-seo-files.mjs         sitemap.xml / robots.txt 생성
```

소단원마다 `/{대단원}/{소단원}` 경로의 정적 페이지가 만들어집니다(예: `/geometry/circle`).
덕분에 모든 주제가 정적 HTML에 담겨 검색·공유가 되고, 주제마다 `#주제id` 앵커로
바로 연결할 수 있습니다.

## 주제를 추가·수정할 때

1. `lib/curriculum.ts`의 해당 소단원 `topics` 배열에 항목을 추가합니다.
   `id`(소단원 안에서 유일한 영문 슬러그)와 `kind`(필터 분류)를 빠뜨리지 마세요.
2. 소단원 자체를 추가했다면 `npm run gen:seo`로 사이트맵을 갱신합니다.
3. `npm run check`로 id 중복·형식·사이트맵 동기화를 확인합니다.

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
