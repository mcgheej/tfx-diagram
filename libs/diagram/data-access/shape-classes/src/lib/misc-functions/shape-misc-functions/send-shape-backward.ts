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
 * The 'id' parameter references the shape that needs to be sent backward
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
export function sendShapeBackward(
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
  const s = getShape(id, modifiedShapes, shapes);
  if (s && s.prevShapeId && s.shapeType !== 'group') {
    let { newFirstId, newLastId } = unlinkShapesById(
      [id],
      modifiedShapes,
      shapes,
      firstId,
      lastId
    );
    const n = getShape(s.prevShapeId, modifiedShapes, shapes);
    if (n) {
      const p = getShape(n.prevShapeId, modifiedShapes, shapes);
      n.prevShapeId = s.id;
      s.nextShapeId = n.id;
      if (p) {
        s.prevShapeId = p.id;
        p.nextShapeId = s.id;
        modifiedShapes.set(p.id, p);
      } else {
        s.prevShapeId = '';
        newFirstId = s.id;
      }
      modifiedShapes.set(s.id, s);
      modifiedShapes.set(n.id, n);
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
