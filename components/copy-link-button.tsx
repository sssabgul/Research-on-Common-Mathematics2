'use client';

import { Check, Link2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

type CopyState = 'idle' | 'copied' | 'fallback';

const MESSAGES: Record<CopyState, string> = {
  idle: '링크 복사',
  copied: '복사했어요',
  fallback: '주소창에서 복사하세요',
};

/**
 * 주제 하나로 바로 가는 링크를 복사한다.
 * 클립보드가 막힌 환경(http, 권한 거부)에서는 주소창에 앵커를 띄워
 * 사용자가 직접 복사할 수 있게 한다.
 */
export function CopyLinkButton({
  href,
  topicId,
  topicTitle,
  className = '',
}: {
  href: string;
  topicId: string;
  topicTitle: string;
  className?: string;
}) {
  const [state, setState] = useState<CopyState>('idle');
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = async () => {
    clearTimeout(timer.current);
    try {
      await navigator.clipboard.writeText(
        new URL(href, window.location.origin).toString(),
      );
      setState('copied');
    } catch {
      window.location.hash = topicId;
      setState('fallback');
    }
    timer.current = setTimeout(() => setState('idle'), 2500);
  };

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={`'${topicTitle}' 링크 복사`}
      className={`inline-flex min-h-8 shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[13px] font-semibold text-[#8e8e93] transition-colors hover:bg-[#f2f2f7] hover:text-[#3a3a3c] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#007aff] ${className}`}
    >
      {state === 'copied' ? (
        <Check className="size-4" aria-hidden="true" />
      ) : (
        <Link2 className="size-4" aria-hidden="true" />
      )}
      <span aria-hidden="true">{MESSAGES[state]}</span>
      <span role="status" className="sr-only">
        {state === 'idle' ? '' : MESSAGES[state]}
      </span>
    </button>
  );
}
