import { propositions } from './data.js';
import { primeResult, digitResult } from './math.js';

import {
  summaries,
  formulas,
  concepts,
  reflections,
  groups,
} from './catalog.js';

const hiddenSummaryIds = new Set([1, 2, 3, 4, 6, 8, 9, 10, 11, 12, 13, 14, 19]);
const titleOf = (item) =>
  item.id === 4 ? '홀수를 더하면 제곱수이다?' : item.title;

const answers = new Map();
const revealed = new Set();
const main = document.querySelector('#main');
const pad = (n) => String(n).padStart(2, '0');
const numberOf = (id) => propositions.findIndex((item) => item.id === id) + 1;

function overview() {
  document.title = '재미있는 명제들 — 열다섯 번의 수학적 발견';
  main.innerHTML = `<section class="intro"><div><h1>참일까, <span>거짓일까?</span></h1><p class="intro-copy">당연해 보이는 생각도 한 번 더.<br>15개의 명제에서 증명과 반례를 발견해 보세요.</p></div><aside class="intro-note"><div>먼저 예상하고<br>이유를 확인하세요.</div></aside></section>
    <div class="how"><span><b>01</b> 명제 고르기</span><span><b>02</b> 참·거짓 예상하기</span><span><b>03</b> 증명과 반례 살펴보기</span></div>
    ${groups
      .map(
        (group, part) =>
          `<section class="collection ${group.start === 20 ? 'paradox-collection' : ''}" aria-labelledby="part-${part}"><div class="section-heading"><div><span class="part">PART ${pad(part + 1)}</span><h2 id="part-${part}">${group.title}</h2></div></div><div class="cards">${propositions
            .filter((p) => p.id >= group.start && p.id <= group.end)
            .map(
              (p) =>
                `<a class="card tone-${p.id % 4} ${hiddenSummaryIds.has(p.id) ? 'without-summary' : ''}" href="#proposition-${p.id}"><div class="card-top"><span class="card-number">${pad(numberOf(p.id))}</span><span class="tag">${concepts[p.id - 1]}</span></div><div class="formula" aria-hidden="true">${formulas[p.id - 1]}</div><h3>${titleOf(p)}</h3>${hiddenSummaryIds.has(p.id) ? '' : `<p>${summaries[p.id - 1]}</p>`}<div class="card-bottom"><span>${revealed.has(p.id) ? '다시 살펴보기' : '탐구하기'}</span><span aria-hidden="true">↗</span></div></a>`,
            )
            .join('')}</div></section>`,
      )
      .join('')}
    <aside class="principle"><span class="principle-mark" aria-hidden="true">∀</span><div><h2>“모든”을 뒤집는 데는 반례 하나면 충분해요.</h2><p>하지만 “모든”이 참임을 보이려면, 몇 가지 사례를 넘어 항상 성립하는 이유가 필요합니다.</p></div></aside>`;
}

function detail(id) {
  const p = propositions.find((item) => item.id === id);
  if (!p) {
    overview();
    return;
  }
  document.title = `${pad(numberOf(id))}. ${titleOf(p)} — 재미있는 명제들`;
  const index = propositions.findIndex((item) => item.id === id);
  const previous = propositions[index - 1];
  const next = propositions[index + 1];
  const answer = answers.get(id);
  const groupIndex = groups.findIndex(
    (group) => id >= group.start && id <= group.end,
  );
  const isParadox = p.kind === 'paradox';
  main.innerHTML = `<div class="detail-toolbar"><a class="back" href="#">← 모든 명제</a><span>${index + 1} / ${propositions.length}</span></div><div class="detail-layout"><aside class="topic-nav" aria-label="명제 목록"><p class="eyebrow">열다섯 개의 물음표</p>${propositions.map((item) => `<a href="#proposition-${item.id}" ${item.id === id ? 'aria-current="page"' : ''}><span>${pad(numberOf(item.id))}</span>${concepts[item.id - 1]}</a>`).join('')}</aside><article class="article"><p class="eyebrow">PART ${pad(groupIndex + 1)} · ${groups[groupIndex].label} <span class="concept">${concepts[id - 1]}</span></p><h1 tabindex="-1">${titleOf(p)}</h1><section class="statement" aria-label="생각할 명제"><span class="statement-label">명제 ${pad(numberOf(id))}</span><div class="statement-text">${p.statement}</div>${p.condition ? `<p class="condition"><strong>조건</strong> ${p.condition}</p>` : ''}</section>
    <section class="prediction" aria-labelledby="prediction-title"><div><p class="step">01 / 나의 예상</p><h2 id="prediction-title">${isParadox ? '이발사는 자신의 수염을 깎아야 할까요?' : '이 명제, 어떻게 생각하나요?'}</h2><p>${isParadox ? '깎는 경우와 깎지 않는 경우에 규칙을 각각 적용해 보세요.' : '항상 성립할 이유나 반례를 먼저 떠올려 보세요.'}</p></div><div class="answer-buttons ${isParadox ? 'paradox-answers' : ''}">${isParadox ? ['shaves', 'does-not-shave', 'impossible'].map((choice, i) => `<button data-paradox="${choice}" aria-pressed="${answer === choice}">${['스스로 깎는다', '스스로 깎지 않는다', '그런 이발사는 없다'][i]}</button>`).join('') : `<button data-answer="true" aria-pressed="${answer === true}"><span aria-hidden="true">○</span> 참 같아요</button><button data-answer="false" aria-pressed="${answer === false}"><span aria-hidden="true">×</span> 거짓 같아요</button>`}</div><p id="guess-note" class="guess-note" role="status">${guessNote(p, answer)}</p></section>
    ${p.backward ? `<section class="analysis-prompt"><p class="step">결론에서 거꾸로</p><h2>무엇을 보이면 충분할까요?</h2><p>${p.backward}</p><small>아래 풀이를 열기 전에, 근거에서 결론으로도 이어지는지 생각해 보세요.</small></section>` : ''}
    <details class="solution" ${revealed.has(id) ? 'open' : ''}><summary><span><small>02 / 증명과 반례</small><strong>판정과 풀이 살펴보기</strong></span><span class="expand" aria-hidden="true">＋</span></summary><div class="solution-body"><div class="verdict ${p.answer ? 'true' : 'false'}"><span class="verdict-icon" aria-hidden="true">${p.answer ? '○' : '×'}</span><div><h2>${p.verdict}</h2><p id="feedback">${feedback(p, answer)}</p></div></div><div id="activity"></div><div class="proof"><h3>왜 그럴까요?</h3>${p.proof}</div>${p.forward ? `<aside class="forward-check"><h3>근거에서 결론까지 다시 확인</h3><p>${p.forward}</p></aside>` : ''}<aside class="insight"><span>발견의 순간</span><p>${p.insight}</p></aside><div class="connection"><h3>${id >= 13 || id <= 6 ? '명제 단원과 연결하기' : '대학 수학으로 한 걸음'}</h3><p>${p.connection}</p></div><div class="reflection"><span class="step">03 / 한 걸음 더</span><h3>${reflections[id - 1]}</h3><p>조건을 바꾸거나, 명제의 부정을 문장으로 써 보세요.</p></div></div></details>
    <nav class="pager" aria-label="이전 다음 명제">${previous ? `<a href="#proposition-${previous.id}">← 이전 명제<span>${concepts[previous.id - 1]}</span></a>` : '<span></span>'}${next ? `<a href="#proposition-${next.id}">다음 명제 →<span>${concepts[next.id - 1]}</span></a>` : '<a href="#">모든 명제 다시 보기 →<span>모든 명제로 돌아가기</span></a>'}</nav></article></div>`;
  document.querySelectorAll('[data-answer]').forEach((button) =>
    button.addEventListener('click', () => {
      const choice = button.dataset.answer === 'true';
      answers.set(id, choice);
      document
        .querySelectorAll('[data-answer]')
        .forEach((b) => b.setAttribute('aria-pressed', String(b === button)));
      document.querySelector('#guess-note').textContent =
        `‘${choice ? '참' : '거짓'}’을 골랐어요. 이제 이유를 비교해 보세요.`;
      document.querySelector('#feedback').textContent = feedback(p, choice);
    }),
  );
  document.querySelector('.solution').addEventListener('toggle', (event) => {
    if (event.target.open) revealed.add(id);
  });
  document.querySelectorAll('[data-paradox]').forEach((button) =>
    button.addEventListener('click', () => {
      const choice = button.dataset.paradox;
      answers.set(id, choice);
      document
        .querySelectorAll('[data-paradox]')
        .forEach((b) => b.setAttribute('aria-pressed', String(b === button)));
      document.querySelector('#guess-note').textContent = guessNote(p, choice);
      document.querySelector('#feedback').textContent = feedback(p, choice);
    }),
  );
  mountActivity(id);
}

function mountActivity(id) {
  const target = document.querySelector('#activity');
  if (id === 2) {
    target.innerHTML =
      '<section class="activity"><h3>직접 확인 · 공식에 수 넣어 보기</h3><label for="prime-n">자연수 n: <strong id="prime-label">1</strong></label><input id="prime-n" type="range" min="1" max="60" value="1"><output id="prime-result" for="prime-n" aria-live="polite"></output><button id="counterexample">반례 n = 40 넣기</button><p class="experiment-note">소수가 여러 번 나와도 증명은 아닙니다. 소수가 아닌 경우 하나를 찾으면 충분해요.</p></section>';
    const input = document.querySelector('#prime-n');
    const update = () => {
      const n = Number(input.value);
      const result = primeResult(n);
      document.querySelector('#prime-label').textContent = n;
      document.querySelector('#prime-result').textContent =
        `${n}² + ${n} + 41 = ${result.value} · ${result.prime ? '소수' : `${result.factor} × ${result.value / result.factor}, 합성수`}`;
    };
    input.addEventListener('input', update);
    document.querySelector('#counterexample').addEventListener('click', () => {
      input.value = '40';
      update();
    });
    update();
  } else if (id === 4) {
    target.innerHTML =
      '<section class="activity"><h3>눈으로 확인 · 홀수로 쌓은 정사각형</h3><label for="odd-n">더할 홀수의 개수 n</label><input id="odd-n" type="range" min="1" max="9" value="4"><div class="dots" role="img"></div><output id="odd-result" for="odd-n" aria-live="polite"></output><p>초록색은 마지막으로 더한 홀수만큼의 칸이에요. 한 겹을 더할 때마다 정사각형이 만들어집니다.</p></section>';
    const input = document.querySelector('#odd-n');
    const update = () => {
      const n = Number(input.value);
      const dots = document.querySelector('.dots');
      dots.style.gridTemplateColumns = `repeat(${n}, 1fr)`;
      dots.setAttribute(
        'aria-label',
        `${n} 곱하기 ${n} 정사각형. 마지막 가장자리 ${2 * n - 1}칸을 강조했습니다.`,
      );
      dots.innerHTML = Array.from(
        { length: n * n },
        (_, i) =>
          `<span class="${Math.floor(i / n) === n - 1 || i % n === n - 1 ? 'new' : ''}"></span>`,
      ).join('');
      document.querySelector('#odd-result').textContent =
        `${Array.from({ length: n }, (_, i) => 2 * i + 1).join(' + ')} = ${n * n} = ${n}²`;
    };
    input.addEventListener('input', update);
    update();
  } else if (id === 6) {
    target.innerHTML =
      '<section class="activity"><h3>직접 확인 · 숫자를 거꾸로 읽으면?</h3><label for="digits">자연수 입력 (최대 9자리)</label><input id="digits" type="text" inputmode="numeric" maxlength="9" value="752" aria-describedby="digit-help"><output id="digit-result" for="digits" aria-live="polite"></output><p id="digit-help">순서를 뒤집는 것도 자릿수 재배열의 한 가지예요. 앞자리의 0은 생략하며, 차가 0이거나 음수여도 9의 배수입니다.</p><p class="experiment-note">이 계산은 사례 확인입니다. 모든 재배열에 대한 이유는 아래 풀이에서 살펴보세요.</p></section>';
    const input = document.querySelector('#digits');
    const update = () => {
      const result = digitResult(input.value);
      input.setAttribute('aria-invalid', String(!result));
      document.querySelector('#digit-result').textContent = result
        ? `${result.original} − ${result.reversed} = ${result.difference} = 9 × (${result.quotient})`
        : '0부터 9까지의 숫자를 1~9자리 입력해 주세요.';
    };
    input.addEventListener('input', update);
    update();
  }
}

function guessNote(p, answer) {
  if (answer === undefined) return '아직 확신이 없어도 괜찮아요.';
  const label =
    p.kind === 'paradox'
      ? {
          shaves: '스스로 깎는다',
          'does-not-shave': '스스로 깎지 않는다',
          impossible: '그런 이발사는 없다',
        }[answer]
      : answer
        ? '참'
        : '거짓';
  return `‘${label}’을 골랐어요. 이제 이유를 비교해 보세요.`;
}

function feedback(p, answer) {
  if (p.kind === 'paradox') {
    if (answer === undefined)
      return '존재한다는 가정에 규칙을 적용하면 모순이 생깁니다.';
    return answer === 'impossible'
      ? '맞아요. 두 선택 모두 모순이므로 존재 가정을 버려야 합니다.'
      : '그 선택에 규칙을 적용하면 반대 행동을 요구하게 됩니다. 두 경우를 확인해 보세요.';
  }
  if (answer === undefined)
    return p.answer
      ? '핵심은 항상 성립하는 이유를 찾는 데 있어요.'
      : '반례 하나로 전체에 대한 주장을 뒤집을 수 있어요.';
  return answer === p.answer
    ? '예상과 같네요! 논증까지 확인해 보세요.'
    : '예상과 달랐나요? 어떤 조건을 놓쳤는지 함께 살펴보세요.';
}

function render(focus = false) {
  const match = location.hash.match(/^#proposition-(\d+)$/);
  if (match) detail(Number(match[1]));
  else overview();
  if (focus) {
    window.scrollTo(0, 0);
    const heading = main.querySelector('h1') || main;
    heading.setAttribute('tabindex', '-1');
    heading.focus({ preventScroll: true });
  }
}
document.querySelector('.skip').addEventListener('click', (event) => {
  event.preventDefault();
  main.focus();
  main.scrollIntoView();
});
window.addEventListener('hashchange', () => render(true));
render();
