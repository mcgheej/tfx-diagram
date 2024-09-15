import { getDrawableShapeIdsInSelection } from '../../misc-functions';
import { Shape } from '../../shape-hierarchy/shape';
import { getShape } from './get-shape';
import { linkShapeArray } from './link-shape-array';
import { unlinkShapesById } from './unlink-shapes-by-id';

/**
 *
 * @param selectedIds
 * @param firstId
 * @param lastId
 * @param shapes
 * @returns
 *
 * The 'ids' parameter is an array of ids that reference a set of shape
 * objects selected by the user that need to be moved to the end of a
 * list of shape objects.
 *
 * The shape objects that need to be moved can be found in the 'shapes'
 * Map parameter.
 *
 * The links to the start and end of the list are provided by the 'firstId'
 * and 'lastId' parameters respectively.
 *
 */
export function bringShapesToFrontById(
  selectedIds: string[],
  firstId: string,
  lastId: string,
  shapes: Map<string, Shape>
): {
  newFirstId: string;
  newLastId: string;
  modifiedShapes: Map<string, Shape>;
} {
  // First unlink all shapes from the list. The supplied ids, in 'selectedIds',
  // may contain group ids as well as shape ids. The getDrawableShapeIdsInSelection
  // function returns the ids for all drawable shapes in the selection, including
  // shapes in any selected groups.
  const result = unlinkShapesById(
    getDrawableShapeIdsInSelection(selectedIds, shapes),
    new Map<string, Shape>(),
    shapes,
    firstId,
    lastId
  );
  let { unlinkedShapes: selectedShapes, newFirstId, newLastId } = result;
  const { modifiedShapes } = result;

  // Next link the selected shapes together and then set them in the
  // modifiedShapes Map.
  selectedShapes = linkShapeArray(selectedShapes);
  selectedShapes.map((s) => modifiedShapes.set(s.id, s));

  // Get the final shape in the list of shape objects and index of the last
  // selected shape in the freshly linked selected shape objects
  const f = getShape(newLastId, modifiedShapes, shapes);
  const l = selectedShapes.length - 1;

  // If there is a final shape object in the list then link the selected
  // shape objects to the end of the list. As the final shape, 'f', is
  // modified set it in the 'modifiedShapes' Map.
  // If there is not final shape then simply make the selected shapes the
  // list by setting up 'newFirstId' and 'newLastId' to reference the first
  // and last shapes in the 'selectedShapes' array.
  if (f) {
    f.nextShapeId = selectedShapes[0].id;
    selectedShapes[0].prevShapeId = f.id;
    newLastId = selectedShapes[l].id;
    modifiedShapes.set(f.id, f);
  } else {
    newFirstId = selectedShapes[0].id;
    newLastId = selectedShapes[l].id;
  }

  // Return the result, which is:
  //    - the id of the first shape object in the list.
  //    - the id of the last shape object in the list.
  //    - Map of all shape objects modified to bring the
  //      selected shape objects to the front, i.e. drawn
  //      last.
  return {
    newFirstId,
    newLastId,
    modifiedShapes,
  };
}
