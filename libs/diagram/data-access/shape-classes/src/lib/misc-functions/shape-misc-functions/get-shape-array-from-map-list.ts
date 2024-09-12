import { Shape } from '../../shape';

/**
 *
 * @param startId - id of first shape object in linked list
 * @param shapes - Map containing shape objects
 * @returns - array of shape objects
 *
 * The 'startId' parameter identifies the first shape in a linked
 * list of shapes. Each shape contains a 'nextShapeId' property
 * which identifies the next shape in the linked list. The last shape
 * in the linked list will have a 'nextShapeId' set to the empty
 * string.
 *
 * The shape objects are help in a Map collection passed in the 'shapes'
 * parameter. The function simply runs through the linked list adding
 * a reference to each shape object in the list to the result array until
 * either the end of the list is detected or a shape id fails to reference
 * a shape object in the 'shapes' Map.
 *
 * The resulting array of Shape objects (actually references to the object
 * in the supplied Map of Shape objects) is returned.
 */
export function getShapeArrayFromMapList(
  startId: string,
  shapes: Map<string, Shape>
): Shape[] {
  let id = startId;
  const result: Shape[] = [];

  while (id) {
    const shape = shapes.get(id);
    if (shape) {
      result.push(shape);
      id = shape.nextShapeId;
    } else {
      id = '';
    }
  }
  return result;
}
