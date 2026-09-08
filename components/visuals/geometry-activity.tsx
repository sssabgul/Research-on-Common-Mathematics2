'use client';
import type { VisualDefinition } from '@/lib/visuals/types';
import { geometryScene } from '@/lib/visuals/geometry';
import { Activity } from './activity';
export function GeometryActivity({
  definition,
}: {
  definition: VisualDefinition;
}) {
  return (
    <Activity
      key={definition.key}
      definition={definition}
      evaluate={geometryScene}
    />
  );
}
