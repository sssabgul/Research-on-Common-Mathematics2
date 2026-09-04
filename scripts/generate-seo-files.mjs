/**
 * public/sitemap.xml 과 public/robots.txt 생성.
 *
 * vinext의 app/sitemap.ts / app/robots.ts는 output: 'export' 빌드에서 파일을
 * 내보내지 않아(검증: dist/client에 없음) 정적 파일로 만들어 커밋한다.
 * public/ 아래 파일은 빌드 때 dist/client로 그대로 복사된다.
 *
 * 실행: npm run gen:seo
 *   → lib/site.ts의 SITE_URL을 실제 도메인으로 바꾼 뒤 반드시 다시 실행할 것.
 *   → 데이터와 어긋나면 npm run check가 잡아낸다.
 */
import { curriculumUnits } from '../lib/curriculum.ts';
import { SITE_URL } from '../lib/site.ts';

const NEWLINE = String.fromCharCode(10);

function allPaths() {
  return [
    '/',
    ...curriculumUnits.flatMap((unit) =>
      unit.subunits.map((subunit) => `/${unit.id}/${subunit.id}`),
    ),
  ];
}

export function buildSitemap() {
  const urls = allPaths()
    .map((path) =>
      [
        '  <url>',
        `    <loc>${SITE_URL}${path === '/' ? '' : path}</loc>`,
        '    <changefreq>monthly</changefreq>',
        `    <priority>${path === '/' ? '1.0' : '0.8'}</priority>`,
        '  </url>',
      ].join(NEWLINE),
    )
    .join(NEWLINE);

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    urls,
    '</urlset>',
    '',
  ].join(NEWLINE);
}

export function buildRobots() {
  return [
    'User-agent: *',
    'Allow: /',
    '',
    `Sitemap: ${SITE_URL}/sitemap.xml`,
    '',
  ].join(NEWLINE);
}

export const SEO_FILES = [
  ['public/sitemap.xml', buildSitemap],
  ['public/robots.txt', buildRobots],
];

if (process.argv[1]?.endsWith('generate-seo-files.mjs')) {
  const { writeFileSync } = await import('node:fs');
  for (const [file, build] of SEO_FILES) {
    writeFileSync(file, build());
    console.log(`OK — ${file}`);
  }
}
