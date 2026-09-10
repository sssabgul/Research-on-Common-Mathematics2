/**
 * 정적 빌드 산출물 검사 — `npm run build` 뒤에 자동 실행된다(postbuild).
 *
 * Netlify에는 서버가 없다. `dist/client` 폴더가 곧 사이트 전부다. 그래서 두 가지가
 * 모두 있어야 한 페이지가 제대로 동작한다.
 *
 *   1) `<경로>.html`  — 주소로 직접 들어오거나 새로고침할 때 쓰인다.
 *   2) `<경로>.txt`   — 카드의 "자세히"처럼 링크를 눌러 이동할 때 App Router가
 *                       가져가는 RSC(Flight) 페이로드다. 확장자는 text/plain이지만
 *                       내용은 서버 컴포넌트 데이터다.
 *
 * 실제로 (2)가 없어서 사고가 났었다. 빌드는 성공하고 Netlify도 Published라고
 * 표시하는데, "자세히"를 눌러도 아무 일이 일어나지 않았다. HTML만 세는 검사로는
 * 못 잡는 종류의 고장이라 둘 다 확인한다.
 *
 * 기대 경로는 public/sitemap.xml에서 읽는다. 사이트맵이 데이터와 어긋나는지는
 * npm run check가 따로 본다. 이 파일은 .ts를 읽지 않으므로 Netlify의 Node에서도
 * 그대로 돈다.
 */
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const OUT = 'dist/client';

if (!existsSync(OUT)) {
  console.error(`${OUT}가 없다 — npm run build를 먼저 실행할 것.`);
  process.exit(1);
}

const sitemap = readFileSync('public/sitemap.xml', 'utf8');
const canonicalUrls = new Map(
  [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => [
    new URL(m[1]).pathname,
    m[1],
  ]),
);
const paths = [...canonicalUrls.keys()];

if (paths.length === 0) {
  console.error(
    'public/sitemap.xml에서 경로를 못 읽었다 — npm run gen:seo 실행',
  );
  process.exit(1);
}

const missing = [];

for (const path of paths) {
  // '/' 는 index.html / index.txt, 나머지는 경로 그대로 확장자만 붙는다.
  const base = path === '/' ? 'index' : path.replace(/^\//, '');
  for (const ext of ['.html', '.txt']) {
    const file = join(OUT, base + ext);
    if (!existsSync(file)) missing.push(`${path} → ${base}${ext} 없음`);
  }
}

// 없는 주소로 들어왔을 때 보여줄 페이지.
// Every detailed route must retain its default visual in static HTML, including
// client activities before hydration. Keep this file compatible with Node 22.14.
const excludedVisuals = new Set([
  '/geometry/section-point/bezier',
  '/logic/propositions/even-square-proof',
]);
const detailedPaths = paths.filter(
  (path) => path.split('/').filter(Boolean).length === 3,
);
let visualCount = 0;
let reportCount = 0;
for (const path of detailedPaths) {
  const file = join(OUT, path.slice(1) + '.html');
  if (!existsSync(file)) continue;
  const html = readFileSync(file, 'utf8');
  const reportButtons = [
    ...html.matchAll(
      /<a\b([^>]*\bdata-report-form="ready"[^>]*)>([\s\S]*?)<\/a>/g,
    ),
  ];
  if (reportButtons.length !== 2) {
    missing.push(path + ' → 상단·하단 보고서 작성 버튼 2개가 필요함');
  } else {
    const reportUrls = [];
    for (const [, attributes, contents] of reportButtons) {
      const attr = (name) =>
        attributes.match(new RegExp(`\\b${name}="([^"]*)"`))?.[1];
      if (
        !contents.includes('탐구계획서 작성') ||
        !attr('class')?.includes('print:hidden')
      ) {
        missing.push(path + ' → 보고서 버튼 문구·인쇄 제외 누락');
      }
      const rel = (attr('rel') ?? '').split(/\s+/);
      if (
        attr('target') !== '_blank' ||
        !rel.includes('noopener') ||
        !rel.includes('noreferrer') ||
        !contents.includes('새 탭')
      ) {
        missing.push(path + ' → 보고서 링크의 새 탭 안내·속성 누락');
      }
      try {
        const url = new URL((attr('href') ?? '').replaceAll('&amp;', '&'));
        const entries = [...url.searchParams].filter(([key]) =>
          /^entry\.\d+$/.test(key),
        );
        if (
          url.origin !== 'https://docs.google.com' ||
          !/^\/forms\/d\/(?:e\/)?[\w-]+\/viewform$/.test(url.pathname) ||
          entries.length !== 3 ||
          !entries.some(([, value]) => value === canonicalUrls.get(path))
        ) {
          missing.push(
            path + ' → 보고서 양식 주소·사전 입력·정식 상세 주소 불일치',
          );
        }
        reportUrls.push(url.href);
      } catch {
        missing.push(path + ' → 보고서 링크가 유효한 URL이 아님');
      }
    }
    if (reportUrls.length === 2 && reportUrls[0] === reportUrls[1])
      reportCount++;
    else missing.push(path + ' → 상단·하단 보고서 연결 상태가 다름');
  }
  const hasVisual = html.includes('data-topic-visual="' + path.slice(1) + '"');
  if (excludedVisuals.has(path)) {
    if (hasVisual) missing.push(path + ' → 제외 주제에 새 자료가 있음');
  } else {
    if (!hasVisual || !html.includes('관찰해 보세요') || !html.includes('<svg'))
      missing.push(path + ' → 기본 시각자료·관찰 질문 누락');
    else visualCount++;
  }
}
if (visualCount !== 41)
  missing.push('새 시각자료가 포함된 상세 HTML은 41개여야 함: ' + visualCount);
if (reportCount !== detailedPaths.length)
  missing.push('모든 상세 페이지에 상단·하단 보고서 연결이 필요함');

if (!existsSync(join(OUT, '404.html')))
  missing.push('404 페이지 → 404.html 없음');

if (missing.length > 0) {
  console.error(`정적 산출물 누락 ${missing.length}건:\n`);
  for (const item of missing) console.error(`  - ${item}`);
  console.error(
    '\n페이지가 정적 파일로 나오지 않았다. next.config.ts의 output, vinext 버전을 확인할 것.',
  );
  process.exit(1);
}

console.log(
  `OK — 정적 페이지 ${paths.length}개 (HTML + RSC 페이로드) / 404 / 시각자료 ${visualCount}개 + 제외 ${excludedVisuals.size}개 / 보고서 연결 ${reportCount}개`,
);
