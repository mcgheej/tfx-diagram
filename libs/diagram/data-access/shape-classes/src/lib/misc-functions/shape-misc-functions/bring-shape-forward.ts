/* eslint-disable prefer-const */
import { Shape } from '../../shape';
import { getShape } from './get-shape';
import { unlinkShapesById } from './unlink-shapes-by-id';

/**
 *
 * @param id
 * @param modifiedShapes
 * @param shapes
 * @param firstId
 * @param lastId
 * @returns
 *
 * The 'id' parameter references the shape that needs to be brought forward
 * in the draw list. If the shape selected is a group then this function will
 * return no changes and the drawing list will not be modified
 *
 * The shape object referenced by the 'id' will be found in either the
 * 'modifiedShapes' Map (objects already modified) or the 'shapes' Map (objects
 * held in ngrx store).
 *
 * The links to the start and end of the draw list are provided in the 'firstId'
 * and 'lastId' parameters respectively.
 */
export function bringShapeForward(
  id: string,
  modifiedShapes: Map<string, Shape>,
  shapes: Map<string, Shape>,
  firstId: string,
  lastId: string
): {
  newFirstId: string;
  newLastId: string;
  modifiedShapes: Map<string, Shape>;
} {
  // First get the selected shape object using the id' parameter.
  // If it doesn't exist or it is a group shape then simply return
  // result indicating no change required
  const s = getShape(id, modifiedShapes, shapes);
  if (s && s.nextShapeId && s.shapeType !== 'group') {
    // Unlink the shape object from the draw list. As well as returning
    // values for newFirstId and newLastId the 'unlinkShapesById' function
    // also adds/amends shape objects in the 'modifiedShapes' Map as
    // required to unlink the selected shape object
    let { newFirstId, newLastId } = unlinkShapesById(
      [id],
      modifiedShapes,
      shapes,
      firstId,
      lastId
    );

    // To bring the selected shape forward it needs to be added
    // to the draw list after the shape object that currently
    // follows it (s.nextShapeId). Here 'p' will become the
    // previous shape.
    const p = getShape(s.nextShapeId, modifiedShapes, shapes);
    if (p) {
      const n = getShape(p.nextShapeId, modifiedShapes, shapes);
      p.nextShapeId = s.id;
      s.prevShapeId = p.id;
      if (n) {
        s.nextShapeId = n.id;
        n.prevShapeId = s.id;
        modifiedShapes.set(n.id, n);
      } else {
        s.nextShapeId = '';
        newLastId = s.id;
      }
      modifiedShapes.set(s.id, s);
      modifiedShapes.set(p.id, p);
    }
    return {
      newFirstId,
      newLastId,
      modifiedShapes,
    };
  }
  return {
    newFirstId: firstId,
    newLastId: lastId,
    modifiedShapes,
  };
}
