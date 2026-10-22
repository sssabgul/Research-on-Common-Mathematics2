import katex from 'katex';
import { readFile } from 'node:fs/promises';
import { excludedIds } from '../src/catalog.js';

export async function loadPropositions() {
  const sources = await Promise.all(
    ['propositions.md', 'additional-propositions.md'].map((file) =>
      readFile(new URL(`../content/${file}`, import.meta.url), 'utf8'),
    ),
  );
  return sources
    .flatMap(parseSource)
    .filter((item) => !excludedIds.includes(item.id));
}

const escape = (text) =>
  text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');

export function inline(text) {
  return text
    .split(/(\$[^$\n]+\$)/g)
    .map((part) => {
      if (part.startsWith('$') && part.endsWith('$'))
        return katex.renderToString(part.slice(1, -1), {
          throwOnError: true,
          trust: false,
          output: 'htmlAndMathml',
        });
      return escape(part).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    })
    .join('');
}

export function markdown(text) {
  return text
    .trim()
    .split(/\n\s*\n/)
    .map((block) => {
      const value = block.trim();
      if (value.startsWith('$$') && value.endsWith('$$'))
        return `<div class="equation">${katex.renderToString(value.slice(2, -2).trim(), { displayMode: true, throwOnError: true, trust: false })}</div>`;
      if (value.startsWith('|')) {
        const rows = value
          .split('\n')
          .filter((row) => !/^\|[\s:|-]+\|$/.test(row));
        return `<div class="table-scroll"><table>${rows
          .map(
            (row, i) =>
              `<tr>${row
                .split('|')
                .slice(1, -1)
                .map(
                  (cell, j) =>
                    `<${i === 0 || j === 0 ? 'th' : 'td'}>${inline(cell.trim())}</${i === 0 || j === 0 ? 'th' : 'td'}>`,
                )
                .join('')}</tr>`,
          )
          .join('')}</table></div>`;
      }
      if (value.startsWith('- '))
        return `<ul>${value
          .split('\n')
          .map((line) => `<li>${inline(line.replace(/^- /, ''))}</li>`)
          .join('')}</ul>`;
      return `<p>${inline(value)}</p>`;
    })
    .join('\n');
}

export function parseSource(source) {
  const normalized = source.replaceAll('\r\n', '\n');
  return [
    ...normalized.matchAll(
      /^### (\d+)\. (.+)\n([\s\S]*?)(?=^### |^## |$(?![\s\S]))/gm,
    ),
  ].map((match) => {
    const [, number, title, body] = match;
    const field = (label) =>
      body.match(new RegExp(`\\*\\*${label}:\\*\\* (.+)`))?.[1] ??
      body.match(new RegExp(`\\*\\*${label}: (.+?)\\*\\*`))?.[1] ??
      '';
    const proof = body
      .split('#### 풀이\n')[1]
      ?.split('**재미있는 점:**')[0]
      ?.trim();
    if (!proof || !field('명제') || !field('판정'))
      throw new Error(`명제 ${number} 원문 구조 확인 필요`);
    return {
      id: Number(number),
      title,
      statement: inline(field('명제')),
      condition: inline(field('조건')),
      answer: field('판정').startsWith('참'),
      verdict: field('판정'),
      proof: markdown(proof),
      insight: inline(field('재미있는 점')),
      connection: inline(field('명제 단원 연결') || field('대학 수학 연결')),
      kind: field('유형') === '역설' ? 'paradox' : 'proposition',
      backward: inline(field('거꾸로 생각하기')),
      forward: inline(field('정방향 확인')),
    };
  });
}
