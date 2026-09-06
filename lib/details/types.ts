export type Concept = { name: string; explanation: string; formula?: string };
export type DataTable = {
  caption: string;
  headers: string[];
  rows: string[][];
};
export type Plot = {
  caption: string;
  xLabel: string;
  yLabel: string;
  xRange: [number, number];
  yRange: [number, number];
  series: { label: string; points: [number, number][] }[];
  circles?: { x: number; y: number; r: number; label: string }[];
};
export type TopicDetail = {
  background: string;
  concepts: Concept[];
  example: {
    title: string;
    paragraphs: string[];
    math?: string[];
    table?: DataTable;
    plot?: Plot;
  };
  steps: { title: string; action: string; output: string }[];
  reflection: string[];
  extensions: string[];
  connections: { curriculum: string; career: string };
  sources: { title: string; url: string; note: string }[];
};
export type DetailMap = Record<string, TopicDetail>;

export function steps(items: [string, string, string][]): TopicDetail['steps'] {
  return items.map(([title, action, output]) => ({ title, action, output }));
}
export function concepts(items: [string, string, string?][]): Concept[] {
  return items.map(([name, explanation, formula]) => ({
    name,
    explanation,
    formula,
  }));
}
