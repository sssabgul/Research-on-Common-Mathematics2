'use client';

import { useState } from 'react';
import type {
  VisualDefinition,
  VisualEvaluator,
  VisualState,
} from '@/lib/visuals/types';
import { format } from '@/lib/visuals/shared';
import { SceneView } from './diagrams';

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
  const update = (key: string, value: VisualState[string]) =>
    setState((old) => ({ ...old, [key]: value }));
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
                  onChange={(event) => {
                    const option = control.options.find(
                      (item) => String(item.value) === event.target.value,
                    )!;
                    if (
                      control.id === 'fn' &&
                      option.value === 'reciprocal' &&
                      Number(state.x) === 0
                    )
                      setState((old) => ({ ...old, fn: option.value, x: 1 }));
                    else update(control.id, option.value);
                  }}
                >
                  {control.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            );
          if (
            definition.key.endsWith('/self-inverse') &&
            control.id === 'x' &&
            state.fn === 'reciprocal'
          )
            return (
              <div className="visual-control" key={control.id}>
                <label htmlFor={inputId}>입력 x (0 제외)</label>
                <select
                  id={inputId}
                  value={String(state.x)}
                  onChange={(event) => update('x', Number(event.target.value))}
                >
                  {Array.from({ length: 17 }, (_, i) => -4 + i * 0.5)
                    .filter((x) => x !== 0)
                    .map((x) => (
                      <option key={x} value={x}>
                        {x}
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
