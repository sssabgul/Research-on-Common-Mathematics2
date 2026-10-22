import { mkdir, writeFile, cp } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { createRequire } from 'node:module';
import { loadPropositions } from './content.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = resolve(root, 'dist');
const propositions = await loadPropositions();
if (
  propositions.length !== 15 ||
  new Set(propositions.map((p) => p.id)).size !== 15
)
  throw new Error('명제 15개와 중복 없는 번호가 있어야 합니다.');
await mkdir(output, { recursive: true });
await cp(resolve(root, 'src'), output, { recursive: true });
await writeFile(
  resolve(output, 'data.js'),
  `export const propositions = ${JSON.stringify(propositions)};\n`,
);
const require = createRequire(import.meta.url);
const katexRoot = dirname(require.resolve('katex/package.json'));
await cp(
  resolve(katexRoot, 'dist/katex.min.css'),
  resolve(output, 'katex.min.css'),
);
await cp(resolve(katexRoot, 'dist/fonts'), resolve(output, 'fonts'), {
  recursive: true,
});
await cp(resolve(katexRoot, 'LICENSE'), resolve(output, 'KATEX-LICENSE.txt'));
console.log(
  `독립 웹앱 빌드 완료: 명제 ${propositions.length}개, 수식 및 로컬 글꼴 포함`,
);
