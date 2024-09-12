import { Shape } from '../../shape';
import { getShape } from './get-shape';

/**
 *
 * @param ids
 * @param modifiedShapes
 * @param shapes
 * @param firstId
 * @param lastId
 * @returns
 *
 * The 'ids' parameter is an array of ids that reference a set of
 * shape objects, often selected by the user, that need to be unlinked from
 * a list of shape objects.
 *
 * The shape objects in the list can be found in the 'modifiedShapes' Map
 * parameter, or if not there in the 'shapes' Map parameter (taken from the
 * application ngrx store).
 *
 * The links to the start and end of the list are provided by the 'firstId'
 * and 'lastId' parameters.
 *
 * The function works through the array of 'ids' which results in an object
 * that is returned by the function containing:
 *
 *    - a new first shape id (may or may not be the same as that supplied in
 *      'firstId' parameter)
 *    - a new last shape id (may or may not be the same as that supplied in
 *      'lastId' parameter)
 *    - an array of shape objects that are unlinked from the list. These
 *      shape objects can be manipulated directly as they are not originals
 *      currently held in the ngrx store.
 *    - a Map of shape objects that have been modified to unlink the shape
 *      objects identified by the 'ids' parameter
 */
export function unlinkShapesById(
  ids: string[],
  modifiedShapes: Map<string, Shape>,
  shapes: Map<string, Shape>,
  firstId: string,
  lastId: string
): {
  newFirstId: string;
  newLastId: string;
  unlinkedShapes: Shape[];
  modifiedShapes: Map<string, Shape>;
} {
  const unlinkedShapes: Shape[] = [];
  let newFirstId = firstId;
  let newLastId = lastId;
  ids.map((id) => {
    const s = getShape(id, modifiedShapes, shapes);
    if (s && s.shapeType !== 'group') {
      unlinkedShapes.push(s.copy({}));
      if (s.prevShapeId) {
        if (s.nextShapeId) {
          modifiedShapes = unlinkMidShape(s, modifiedShapes, shapes);
        } else {
          const r = unlinkLastShape(s, modifiedShapes, shapes);
          modifiedShapes = r.modifiedShapes;
          newLastId = r.newLastId;
        }
      } else if (s.nextShapeId) {
        const r = unlinkFirstShape(s, modifiedShapes, shapes);
        modifiedShapes = r.modifiedShapes;
        newFirstId = r.newFirstId;
      } else {
        // Only shape
        newFirstId = '';
        newLastId = '';
      }
      modifiedShapes.delete(s.id);
    }
  });
  return {
    newFirstId,
    newLastId,
    unlinkedShapes,
    modifiedShapes,
  };
}

/**
 *
 * @param s
 * @param modifiedShapes
 * @param shapes
 * @returns
 *
 * The parameter 's' is the shape to be unlinked, which happens to be
 * the first shape in a list of shapes.
 *
 * To unlink the shape the function needs to modify the shape following
 * 's' to be the first shape in the list (set prevShapeId to empty string)
 * and set a new first shape id to reference the shape after 's'. The modified
 * new first shape is set in the 'modifiedShapes' Map.
 *
 * The function returns the revised modifiedShapes Map and the new first
 * shape id.
 */
function unlinkFirstShape(
  s: Shape,
  modifiedShapes: Map<string, Shape>,
  shapes: Map<string, Shape>
): {
  newFirstId: string;
  modifiedShapes: Map<string, Shape>;
} {
  const newFirstShape = getShape(s.nextShapeId, modifiedShapes, shapes);
  if (newFirstShape) {
    newFirstShape.prevShapeId = '';
    modifiedShapes.set(newFirstShape.id, newFirstShape);
  }
  return {
    newFirstId: s.nextShapeId,
    modifiedShapes,
  };
}

/**
 *
 * @param s
 * @param modifiedShapes
 * @param shapes
 * @returns
 *
 * The parameter 's' is the shape to be unlinked, which is part of a list
 * of shapes but not at the front or end of the list (mid list).
 *
 * To unlink the shape the function needs to modify the shapes immediately
 * before and after the shape 's', amending the next shape id value in the
 * preceding shape and the previsous shape id value in the following shape
 * to take the shape ' out of the list. The modified shapes are set in the
 * 'modifiedShapes' Map.
 *
 * The function simply returns the revised 'modifiedShapes Map.
 */
function unlinkMidShape(
  s: Shape,
  modifiedShapes: Map<string, Shape>,
  shapes: Map<string, Shape>
): Map<string, Shape> {
  const prevShape = getShape(s.prevShapeId, modifiedShapes, shapes);
  const nextShape = getShape(s.nextShapeId, modifiedShapes, shapes);
  if (prevShape && nextShape) {
    prevShape.nextShapeId = nextShape.id;
    nextShape.prevShapeId = prevShape.id;
    modifiedShapes.set(prevShape.id, prevShape);
    modifiedShapes.set(nextShape.id, nextShape);
  }
  return modifiedShapes;
}

/**
 *
 * @param s
 * @param modifiedShapes
 * @param shapes
 * @returns
 *
 * The parameter 's' is the shape to be unlinked, which happens to be
 * the last shape in a list of shapes.
 *
 * To unlink the shape the function needs to modify the shape preceding
 * 's' to be the new last shape in the list (set nextShapeId to empty string)
 * and set a new last shape id to reference the shape before 's'. The modified
 * new last shape is set in the 'modifiedShapes' Map.
 *
 * The function returns the revised 'modifiedShapes' Map and the new last shape
 * id.
 */
function unlinkLastShape(
  s: Shape,
  modifiedShapes: Map<string, Shape>,
  shapes: Map<string, Shape>
): {
  newLastId: string;
  modifiedShapes: Map<string, Shape>;
} {
  const newLastShape = getShape(s.prevShapeId, modifiedShapes, shapes);
  if (newLastShape) {
    newLastShape.nextShapeId = '';
    modifiedShapes.set(newLastShape.id, newLastShape);
  }
  return {
    newLastId: s.prevShapeId,
    modifiedShapes,
  };
}
