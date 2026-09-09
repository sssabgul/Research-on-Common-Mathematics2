'use client';

import { useState } from 'react';
import type {
  VisualControl,
  VisualDefinition,
  VisualEvaluator,
  VisualState,
} from '@/lib/visuals/types';
import { format } from '@/lib/visuals/shared';
import { SceneView } from './diagrams';

type RangeControl = Extract<VisualControl, { kind: 'range' }>;
// min~max를 step으로 훑은 값. 0.1 같은 step의 누적 오차를 눈금 계산과 같은 방식으로 정규화한다.
const rangeValues = (control: RangeControl) =>
  Array.from(
    { length: Math.round((control.max - control.min) / control.step) + 1 },
    (_, i) => Number((control.min + i * control.step).toPrecision(12)),
  );
// 다른 컨트롤 값 때문에 지금 정의역에서 빠진 값들. 제외가 없으면 null.
const excludedValues = (control: RangeControl, state: VisualState) =>
  control.excludeWhen &&
  state[control.excludeWhen.control] === control.excludeWhen.equals
    ? control.excludeWhen.values
    : null;

export function Activity({
  definition,
  evaluate,
}: {
  definition: VisualDefinition;
  evaluate: VisualEvaluator;
}) {
  const [state, setState] = useState<VisualState>(() => ({
    ...definition.initial,
  }));
  const id = 'visual-' + definition.key.replaceAll('/', '-');
  const scene = evaluate(definition.key.split('/').at(-1)!, state);
  // 값 하나를 바꾸면 다른 컨트롤이 제외 상태가 될 수 있다. 그 값은 정의역 밖이므로
  // 처음 값으로, 처음 값마저 제외라면 남은 첫 값으로 되돌린다.
  const update = (key: string, value: VisualState[string]) =>
    setState((old) => {
      const next = { ...old, [key]: value };
      for (const control of definition.controls) {
        if (control.kind !== 'range') continue;
        const excluded = excludedValues(control, next);
        if (!excluded?.includes(Number(next[control.id]))) continue;
        const initial = definition.initial[control.id];
        next[control.id] = excluded.includes(Number(initial))
          ? (rangeValues(control).find((v) => !excluded.includes(v)) ?? initial)
          : initial;
      }
      return next;
    });
  return (
    <div className="visual-workspace">
      <SceneView scene={scene} id={id} />
      <div className="visual-controls">
        {definition.controls.map((control) => {
          const inputId = id + '-' + control.id;
          if (control.kind === 'set') {
            const selected = state[control.id] as string[];
            return (
              <fieldset key={control.id}>
                <legend>{control.label}</legend>
                <div className="visual-checkboxes">
                  {control.options.map((value) => (
                    <label key={value}>
                      <input
                        type="checkbox"
                        checked={selected.includes(value)}
                        onChange={(event) =>
                          update(
                            control.id,
                            event.target.checked
                              ? [...selected, value]
                              : selected.filter((v) => v !== value),
                          )
                        }
                      />
                      {value}
                    </label>
                  ))}
                </div>
              </fieldset>
            );
          }
          if (control.kind === 'choice')
            return (
              <div className="visual-control" key={control.id}>
                <label htmlFor={inputId}>{control.label}</label>
                <select
                  id={inputId}
                  value={String(state[control.id])}
                  onChange={(event) =>
                    update(
                      control.id,
                      control.options.find(
                        (item) => String(item.value) === event.target.value,
                      )!.value,
                    )
                  }
                >
                  {control.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            );
          // 정의역에 구멍이 뚫린 동안에는 슬라이더 대신 남은 값만 고르게 한다.
          const excluded = excludedValues(control, state);
          if (excluded)
            return (
              <div className="visual-control" key={control.id}>
                <label htmlFor={inputId}>
                  {control.label} ({excluded.map((v) => format(v)).join(', ')}{' '}
                  제외)
                </label>
                <select
                  id={inputId}
                  value={String(state[control.id])}
                  onChange={(event) =>
                    update(control.id, Number(event.target.value))
                  }
                >
                  {rangeValues(control)
                    .filter((v) => !excluded.includes(v))
                    .map((v) => (
                      <option key={v} value={v}>
                        {format(v)} {control.unit}
                      </option>
                    ))}
                </select>
              </div>
            );
          return (
            <div className="visual-control" key={control.id}>
              <label htmlFor={inputId}>
                {control.label}
                <output htmlFor={inputId}>
                  {format(Number(state[control.id]))} {control.unit}
                </output>
              </label>
              <input
                id={inputId}
                type="range"
                min={control.min}
                max={control.max}
                step={control.step}
                value={Number(state[control.id])}
                onChange={(event) =>
                  update(control.id, Number(event.target.value))
                }
                aria-valuetext={
                  format(Number(state[control.id])) + (control.unit ?? '')
                }
              />
              <div className="visual-range-ends" aria-hidden="true">
                <span>
                  {format(control.min)} {control.unit}
                </span>
                <span>
                  {format(control.max)} {control.unit}
                </span>
              </div>
              {control.presets && (
                <div className="visual-presets">
                  {control.presets.map((value) => (
                    <button
                      type="button"
                      key={value}
                      aria-pressed={state[control.id] === value}
                      onClick={() => update(control.id, value)}
                    >
                      {format(value)} {control.unit}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
        <button
          type="button"
          className="visual-reset"
          onClick={() => setState({ ...definition.initial })}
        >
          처음 값으로
        </button>
      </div>
    </div>
  );
}
