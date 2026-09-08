import { EXCLUDED_VISUAL_KEYS, findTopicVisual } from '@/lib/topic-visuals';
import { geometryScene } from '@/lib/visuals/geometry';
import { logicScene } from '@/lib/visuals/logic';
import { functionScene } from '@/lib/visuals/functions';
import { SceneView } from '@/components/visuals/diagrams';
import { GeometryActivity } from '@/components/visuals/geometry-activity';
import { LogicActivity } from '@/components/visuals/logic-activity';
import { FunctionActivity } from '@/components/visuals/function-activity';

export function TopicVisual({ topicKey }: { topicKey: string }) {
  if (EXCLUDED_VISUAL_KEYS.some((key) => key === topicKey)) return null;
  const definition = findTopicVisual(topicKey);
  if (!definition) throw new Error('시각자료 등록 누락: ' + topicKey);
  const [unit, , id] = topicKey.split('/');
  const domId = 'visual-' + topicKey.replaceAll('/', '-');
  const evaluate =
    unit === 'geometry'
      ? geometryScene
      : unit === 'logic'
        ? logicScene
        : functionScene;
  return (
    <section
      id="topic-visual"
      className="topic-visual"
      data-topic-visual={topicKey}
      data-visual-mode={definition.mode}
      data-unit={unit}
      aria-labelledby={domId + '-heading'}
    >
      <header className="visual-heading">
        <p>
          {definition.mode === 'static'
            ? '그림으로 살펴보기'
            : '직접 움직여 보기'}
        </p>
        <h2 id={domId + '-heading'}>{definition.title}</h2>
      </header>
      {definition.mode === 'static' ? (
        <SceneView scene={evaluate(id, definition.initial)} id={domId} />
      ) : unit === 'geometry' ? (
        <GeometryActivity definition={definition} />
      ) : unit === 'logic' ? (
        <LogicActivity definition={definition} />
      ) : (
        <FunctionActivity definition={definition} />
      )}
      <p className="visual-question">
        <strong>관찰해 보세요</strong>
        {definition.question}
      </p>
    </section>
  );
}
