import { Shape } from '../../shape-hierarchy/shape';
import { getDrawableShapeIdsInSelection } from '../misc-functions';
import { getShape } from './get-shape';
import { linkShapeArray } from './link-shape-array';
import { unlinkShapesById } from './unlink-shapes-by-id';

export function sendShapesToBackById(
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

  // Get the first shape in the list of shape objects and index of the last
  // selected shape in the freshly linked selected shape objects
  const f = getShape(newFirstId, modifiedShapes, shapes);
  const l = selectedShapes.length - 1;

  // If there is a first shape object in the draw list the the selected
  // shapes need to be linked before that shape in the draw list. As the first
  // shape is modified set it in the 'modifiedShapes' Map.
  // If there is not first shape then simply make the selected shapes the
  // list by setting up 'newFirstId' and 'newLastId' to reference the first
  // and last shapes in the 'selectedShapes' array.
  if (f) {
    newFirstId = selectedShapes[0].id;
    selectedShapes[l].nextShapeId = f.id;
    f.prevShapeId = selectedShapes[l].id;
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
