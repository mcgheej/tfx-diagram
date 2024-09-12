import { Group } from '../../control-shapes/group';
import { Shape } from '../../shape';

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
