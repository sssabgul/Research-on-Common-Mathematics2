export type Point = [number, number];
export type VisualState = Record<string, number | string | string[]>;
type ControlBase = { id: string; label: string };
// 다른 컨트롤이 특정 값일 때 정의역에서 빠지는 값들. 서버 컴포넌트가 정의를
// 클라이언트로 넘기므로 함수가 아닌 직렬화 가능한 데이터여야 한다.
export type ExcludeWhen = {
  control: string;
  equals: string | number;
  values: number[];
};
export type VisualControl =
  | (ControlBase & {
      kind: 'range';
      min: number;
      max: number;
      step: number;
      unit?: string;
      presets?: number[];
      excludeWhen?: ExcludeWhen;
    })
  | (ControlBase & {
      kind: 'choice';
      options: { value: string | number; label: string }[];
    })
  | (ControlBase & { kind: 'set'; options: string[] });
export type VisualDefinition = {
  key: string;
  title: string;
  question: string;
} & (
  | { mode: 'static'; initial: VisualState; controls: [] }
  | { mode: 'interactive'; initial: VisualState; controls: VisualControl[] }
);
export type PlotLine = {
  points: Point[];
  label?: string;
  color?: number;
  dashed?: boolean;
  dots?: boolean;
  closed?: boolean;
  fill?: boolean;
  arrow?: boolean;
};
export type PlotDiagram = {
  kind: 'plot';
  title: string;
  bounds: [number, number, number, number];
  equal?: boolean;
  xLabel?: string;
  yLabel?: string;
  axes?: boolean;
  // 라벨 없는 마커만 있는 그림은 <desc>가 비므로 요약을 직접 전달한다.
  description?: string;
  lines?: PlotLine[];
  circles?: {
    center: Point;
    radius: number;
    label?: string;
    color?: number;
    dashed?: boolean;
  }[];
  markers?: {
    point: Point;
    label?: string;
    color?: number;
    open?: boolean;
    shape?: 'circle' | 'diamond';
  }[];
};
export type Diagram =
  | PlotDiagram
  | {
      kind: 'venn';
      title: string;
      aLabel: string;
      bLabel: string;
      a: string[];
      b: string[];
      universe: string[];
      highlight: 'intersection' | 'union' | 'left' | 'right';
    }
  | {
      kind: 'mapping';
      title: string;
      left: string[];
      right: string[];
      links: [number, number][];
    }
  | {
      kind: 'flow';
      title: string;
      steps: { label: string; value: string; shade?: number }[];
    }
  | {
      kind: 'bars';
      title: string;
      unit: string;
      rows: {
        label: string;
        values: { label: string; value: number; color?: number }[];
      }[];
    }
  | {
      kind: 'cards';
      title: string;
      cards: { label: string; value: string; positive: boolean }[];
    }
  | { kind: 'digits'; title: string; rows: string[] }
  | { kind: 'items'; title: string; needed: number; received: number };
export type VisualScene = {
  diagrams: Diagram[];
  facts: { label: string; value: string }[];
  note?: string;
  table?: { caption: string; headers: string[]; rows: string[][] };
};
export type VisualEvaluator = (id: string, state: VisualState) => VisualScene;
