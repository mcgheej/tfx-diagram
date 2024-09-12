import { Group } from '../../control-shapes/group';
import { Shape } from '../../shape';

/**
 * Returns shapes in the selection (includes shapes within
 * groups)
 */
export function getDrawableShapesInSelection(
  selectedShapeIds: string[],
  shapes: Map<string, Shape>
): Shape[] {
  const result: Shape[] = [];
  selectedShapeIds.map((id) => {
    const s = shapes.get(id);
    if (s) {
      if (s.shapeType === 'group') {
        result.push(...Group.drawableShapes(s as Group, shapes));
      } else {
        result.push(s);
      }
    }
  });
  return result;
}
