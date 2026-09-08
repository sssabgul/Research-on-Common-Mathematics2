'use client';
import type { VisualDefinition } from '@/lib/visuals/types';
import { logicScene } from '@/lib/visuals/logic';
import { Activity } from './activity';
export function LogicActivity({
  definition,
}: {
  definition: VisualDefinition;
}) {
  return (
    <Activity
      key={definition.key}
      definition={definition}
      evaluate={logicScene}
    />
  );
}
