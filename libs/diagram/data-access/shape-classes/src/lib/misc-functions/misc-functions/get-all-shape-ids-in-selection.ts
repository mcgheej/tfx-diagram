import { Group } from '../../control-shapes/group';
import { Shape } from '../../shape-hierarchy/shape';

export function getAllShapeIdsInSelection(
  selectedShapeIds: string[],
  shapes: Map<string, Shape>
): string[] {
  const shapeIds: string[] = [];
  selectedShapeIds.map((id) => {
    const s = shapes.get(id);
    if (s) {
      shapeIds.push(s.id);
      if (s.shapeType === 'group') {
        shapeIds.push(...Group.shapeIds(s as Group, shapes));
      }
    }
  });
  return shapeIds;
}
