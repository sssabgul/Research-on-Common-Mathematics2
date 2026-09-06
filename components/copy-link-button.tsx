'use client';

import { Check, Link2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export function CopyLinkButton({
  href,
  topicTitle,
  className = '',
}: {
  href: string;
  topicTitle: string;
  className?: string;
}) {
  const [state, setState] = useState<'idle' | 'copied' | 'fallback'>('idle');
  const [fallbackUrl, setFallbackUrl] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  useEffect(() => {
    if (state === 'fallback') {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [state]);
  const copy = async () => {
    clearTimeout(timer.current);
    const url = new URL(href, window.location.origin).toString();
    try {
      await navigator.clipboard.writeText(url);
      setFallbackUrl('');
      setState('copied');
      timer.current = setTimeout(() => setState('idle'), 2500);
    } catch {
      setFallbackUrl(url);
      setState('fallback');
    }
  };
  const message =
    state === 'copied'
      ? '복사했어요'
      : state === 'fallback'
        ? '아래 주소를 직접 복사하세요'
        : '링크 복사';
  return (
    <div className={'min-w-0 max-w-full ' + className}>
      <button
        type="button"
        onClick={copy}
        aria-label={topicTitle + ' 링크 복사'}
        className="inline-flex min-h-11 items-center gap-1.5 rounded-full px-3 py-2 text-[14px] font-semibold text-[#636366] hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#007aff]"
      >
        {state === 'copied' ? (
          <Check className="size-4" aria-hidden="true" />
        ) : (
          <Link2 className="size-4" aria-hidden="true" />
        )}
        <span aria-hidden="true">{message}</span>
        <output className="sr-only">{state === 'idle' ? '' : message}</output>
      </button>
      {state === 'fallback' && (
        <input
          ref={inputRef}
          readOnly
          value={fallbackUrl}
          onFocus={(event) => event.currentTarget.select()}
          aria-label="직접 복사할 주제 주소"
          className="mt-2 block min-h-11 w-full rounded-lg border bg-white px-3 text-base"
        />
      )}
    </div>
  );
}
