import { Shape } from '../../shape-hierarchy/shape';

/**
 *
 * @param ids - identify which shape objects to get from the shapes Map
 * @param shapes - Map of shape objects
 * @returns array of shape objects
 *
 * Iterates over the supplied ids to build an array of shape object
 */
export function getShapeArrayFromIdArray(
  ids: string[],
  shapes: Map<string, Shape>
): Shape[] {
  const result: Shape[] = [];
  for (const id of ids) {
    const shape = shapes.get(id);
    if (shape) {
      result.push(shape);
    }
  }
  return result;
}
