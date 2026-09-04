import {
  Binary,
  ChartNoAxesCombined,
  Shapes,
  type LucideIcon,
} from 'lucide-react';

import type { UnitId } from '@/lib/curriculum';

// Record<UnitId, …>라서 대단원이 늘거나 id가 바뀌면 컴파일이 막힌다.
// 예전 if/else 방식은 조용히 기본 아이콘으로 떨어졌다.
const UNIT_ICONS: Record<UnitId, LucideIcon> = {
  geometry: Shapes,
  logic: Binary,
  functions: ChartNoAxesCombined,
};

export function UnitIcon({
  id,
  className,
}: {
  id: UnitId;
  className?: string;
}) {
  const Icon = UNIT_ICONS[id];
  return <Icon className={className} aria-hidden="true" />;
}
