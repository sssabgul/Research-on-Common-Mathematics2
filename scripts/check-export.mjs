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
const paths = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
  (m) => new URL(m[1]).pathname,
);

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

console.log(`OK — 정적 페이지 ${paths.length}개 (HTML + RSC 페이로드) / 404`);
