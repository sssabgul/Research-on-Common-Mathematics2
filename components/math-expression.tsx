import katex from 'katex';

export function MathExpression({ formula }: { formula: string }) {
  const html = katex.renderToString(formula, {
    displayMode: true,
    output: 'htmlAndMathml',
    throwOnError: true,
    trust: false,
  });
  // 입력은 저장소에서 작성·검증한 수식만 받는다.
  return (
    <div
      className="math-expression"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
