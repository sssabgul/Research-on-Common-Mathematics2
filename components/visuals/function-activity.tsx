'use client';
import type { VisualDefinition } from '@/lib/visuals/types';
import { functionScene } from '@/lib/visuals/functions';
import { Activity } from './activity';
export function FunctionActivity({
  definition,
}: {
  definition: VisualDefinition;
}) {
  return (
    <Activity
      key={definition.key}
      definition={definition}
      evaluate={functionScene}
    />
  );
}
