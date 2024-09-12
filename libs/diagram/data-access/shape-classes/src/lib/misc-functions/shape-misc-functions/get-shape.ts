import { Shape } from '../../shape';

/**
 *
 * @param id - identifies Shape object to retrieve
 * @param modifiedShapes - Map of modified shape objects
 * @param shapes - Map of immutable shape objects.
 * @returns Shape | undefined
 *
 * If the shape exists in the 'modifiedShapes' Map then it is
 * returned.
 *
 * If the shape doesn't exist in 'modifiedShapes' but does exist in
 * 'shapes' then a copy of the immutable shape from the 'shapes;
 * Map is returned.
 *
 * If the shape cannot be found in either Map then undefined is
 * returned.
 */
export function getShape(
  id: string,
  modifiedShapes: Map<string, Shape>,
  shapes: Map<string, Shape>
): Shape | undefined {
  let shape = modifiedShapes.get(id);
  if (shape) {
    return shape;
  }
  shape = shapes.get(id);
  if (shape) {
    return shape.copy({});
  }
  return undefined;
}
