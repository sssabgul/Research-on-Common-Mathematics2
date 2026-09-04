import type { Tone } from '@/lib/curriculum';

/**
 * 대단원 색조. 예전에는 같은 색표가 page.tsx 세 곳에 흩어져 있어
 * 색 하나 바꾸려면 세 군데를 손대야 했다. 여기가 단일 진실 공급원이다.
 */
export type ToneStyle = {
  /** 소단원 헤더 배너의 그라데이션 */
  gradient: string;
  /** 대단원 설명 줄의 옅은 배경 */
  soft: string;
  /** 소단원 목록에서 선택된 항목 */
  active: string;
  /** 선택된 소단원의 번호 배지 */
  number: string;
  /** 주제 카드의 번호 배지 */
  cardNumber: string;
};

export const toneStyles: Record<Tone, ToneStyle> = {
  blue: {
    gradient: 'from-[#0068d7] to-[#2188df]',
    soft: 'bg-[#eaf4ff] text-[#0066cc]',
    active: 'bg-[#eef6ff] text-[#0066cc] hover:bg-[#e6f1ff]',
    number: 'bg-[#007aff] text-white',
    cardNumber: 'bg-[#e8f2ff] text-[#007aff]',
  },
  purple: {
    gradient: 'from-[#5940b8] to-[#8453cb]',
    soft: 'bg-[#f2edff] text-[#6742c2]',
    active: 'bg-[#f4efff] text-[#6742c2] hover:bg-[#eee7ff]',
    number: 'bg-[#7657e8] text-white',
    cardNumber: 'bg-[#f2edff] text-[#7657e8]',
  },
  orange: {
    gradient: 'from-[#b84a00] to-[#e87500]',
    soft: 'bg-[#fff2df] text-[#a95000]',
    active: 'bg-[#fff4e6] text-[#a95000] hover:bg-[#ffeed8]',
    number: 'bg-[#f27d16] text-white',
    cardNumber: 'bg-[#fff1de] text-[#d86500]',
  },
};
