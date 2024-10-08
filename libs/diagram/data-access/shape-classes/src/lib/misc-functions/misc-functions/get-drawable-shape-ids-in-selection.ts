import { Shape } from '../../shape-hierarchy/shape';
import { Group } from '../../shape-hierarchy/structural-shapes/group/group';

/**
 * Returns ids of all shapes in the selection (includes shapes within
 * groups)
 */
export function getDrawableShapeIdsInSelection(
  selectedShapeIds: string[],
  shapes: Map<string, Shape>
): string[] {
  const shapeIds: string[] = [];
  selectedShapeIds.map((id) => {
    const s = shapes.get(id);
    if (s) {
      if (s.shapeType === 'group') {
        shapeIds.push(...Group.drawableShapeIds(s as Group, shapes));
      } else {
        shapeIds.push(id);
      }
    }
  });
  return shapeIds;
}
