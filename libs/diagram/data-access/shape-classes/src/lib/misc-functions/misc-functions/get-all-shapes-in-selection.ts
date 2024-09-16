import { Shape } from '../../shape-hierarchy/shape';
import { Group } from '../../shape-hierarchy/structural-shapes/group/group';

export function getAllShapesInSelection(
  selectedShapeIds: string[],
  shapes: Map<string, Shape>
): Shape[] {
  const result: Shape[] = [];
  selectedShapeIds.map((id) => {
    const s = shapes.get(id);
    if (s) {
      result.push(s);
      if (s.shapeType === 'group') {
        result.push(...Group.shapes(s as Group, shapes));
      }
    }
  });
  return result;
}
