import { getDrawableShapeIdsInSelection } from './misc-functions';
import { Shape } from './shape';

/**
 *
 * @param ids - identify which shape objects to get from the shapes Map
 * @param shapes - Map of shape objects
 * @returns array of shape objects
 *
 * Iterates over the supplied ids to build an array of shape object
 */
export const getShapesArrayFromIdArray = (
  ids: string[],
  shapes: Map<string, Shape>
): Shape[] => {
  const result: Shape[] = [];
  for (const id of ids) {
    const shape = shapes.get(id);
    if (shape) {
      result.push(shape);
    }
  }
  return result;
};

/**
 *
 * @param startId - id of first shape object in linked list
 * @param shapes - Map containing shape objects
 * @returns - array of shape objects
 */
export const getShapesArrayFromMapList = (
  startId: string,
  shapes: Map<string, Shape>
): Shape[] => {
  let id = startId;
  const result: Shape[] = [];

  // id will be empty string if last shape in list processed or last id
  // processed didn't index to a shape object in the shapes Map
  while (id) {
    const shape = shapes.get(id);
    if (shape) {
      result.push(shape);
      id = shape.nextShapeId;
    } else {
      // Shape object not found so set id to empoty string to stop
      // running through linked shapes.
      id = '';
    }
  }
  return result;
};

/**
 *
 * @param shapes - array of shapes to link
 * @returns same array of shapes but now linked
 *
 * Simply works through the supplied array setting the previous and
 * next id links to link the shapes togather.
 */
export const linkShapeArray = (shapes: Shape[]): Shape[] => {
  if (shapes.length === 0) {
    return shapes;
  }
  if (shapes.length === 1) {
    shapes[0].prevShapeId = '';
    shapes[0].nextShapeId = '';
    return shapes;
  }
  shapes[0].prevShapeId = '';
  shapes[0].nextShapeId = shapes[1].id;
  for (let i = 1; i < shapes.length - 1; i++) {
    shapes[i].prevShapeId = shapes[i - 1].id;
    shapes[i].nextShapeId = shapes[i + 1].id;
  }
  shapes[shapes.length - 1].prevShapeId = shapes[shapes.length - 2].id;
  shapes[shapes.length - 1].nextShapeId = '';
  return shapes;
};

export const bringShapesToFrontById = (
  selectedIds: string[],
  firstId: string,
  lastId: string,
  shapes: Map<string, Shape>
): {
  newFirstId: string;
  newLastId: string;
  modifiedShapes: Map<string, Shape>;
} => {
  const result = unlinkShapesById(
    getDrawableShapeIdsInSelection(selectedIds, shapes),
    new Map<string, Shape>(),
    shapes,
    firstId,
    lastId
  );
  let { selectedShapes, newFirstId, newLastId } = result;
  const { modifiedShapes } = result;
  selectedShapes = linkShapeArray(selectedShapes);
  selectedShapes.map((s) => modifiedShapes.set(s.id, s));
  const l = selectedShapes.length - 1;
  const f = getShape(newLastId, modifiedShapes, shapes);
  if (f) {
    f.nextShapeId = selectedShapes[0].id;
    selectedShapes[0].prevShapeId = f.id;
    newLastId = selectedShapes[l].id;
    modifiedShapes.set(f.id, f);
  } else {
    newFirstId = selectedShapes[0].id;
    newLastId = selectedShapes[l].id;
  }
  return {
    newFirstId,
    newLastId,
    modifiedShapes,
  };
};

export const bringShapeForward = (
  id: string,
  modifiedShapes: Map<string, Shape>,
  shapes: Map<string, Shape>,
  firstId: string,
  lastId: string
): {
  newFirstId: string;
  newLastId: string;
  modifiedShapes: Map<string, Shape>;
} => {
  const s = getShape(id, modifiedShapes, shapes);
  if (s && s.nextShapeId && s.shapeType !== 'group') {
    // eslint-disable-next-line prefer-const
    let { newFirstId, newLastId } = unlinkShapesById(
      [id],
      modifiedShapes,
      shapes,
      firstId,
      lastId
    );
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
};

export const sendShapeBackward = (
  id: string,
  modifiedShapes: Map<string, Shape>,
  shapes: Map<string, Shape>,
  firstId: string,
  lastId: string
): {
  newFirstId: string;
  newLastId: string;
  modifiedShapes: Map<string, Shape>;
} => {
  const s = getShape(id, modifiedShapes, shapes);
  if (s && s.prevShapeId && s.shapeType !== 'group') {
    // eslint-disable-next-line prefer-const
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
};

export const unlinkShapesById = (
  ids: string[],
  modifiedShapes: Map<string, Shape>,
  shapes: Map<string, Shape>,
  firstId: string,
  lastId: string
): {
  newFirstId: string;
  newLastId: string;
  selectedShapes: Shape[];
  modifiedShapes: Map<string, Shape>;
} => {
  const selectedShapes: Shape[] = [];
  let newFirstId = firstId;
  let newLastId = lastId;
  ids.map((id) => {
    const s = getShape(id, modifiedShapes, shapes);
    if (s && s.shapeType !== 'group') {
      selectedShapes.push(s.copy({}));
      if (s.prevShapeId) {
        if (s.nextShapeId) {
          unlinkMidShape(s, modifiedShapes, shapes);
        } else {
          modifiedShapes = unlinkLastShape(s, modifiedShapes, shapes);
          newLastId = s.prevShapeId;
        }
      } else if (s.nextShapeId) {
        modifiedShapes = unlinkFirstShape(s, modifiedShapes, shapes);
        newFirstId = s.nextShapeId;
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
    selectedShapes,
    modifiedShapes,
  };
};

export const getShape = (
  id: string,
  modifiedShapes: Map<string, Shape>,
  shapes: Map<string, Shape>
): Shape | undefined => {
  let shape = modifiedShapes.get(id);
  if (shape) {
    return shape;
  }
  shape = shapes.get(id);
  if (shape) {
    return shape.copy({});
  }
  return undefined;
};

const unlinkFirstShape = (
  s: Shape,
  modifiedShapes: Map<string, Shape>,
  shapes: Map<string, Shape>
): Map<string, Shape> => {
  const newFirstShape = getShape(s.nextShapeId, modifiedShapes, shapes);
  if (newFirstShape) {
    newFirstShape.prevShapeId = '';
    modifiedShapes.set(newFirstShape.id, newFirstShape);
  }
  return modifiedShapes;
};

const unlinkMidShape = (
  s: Shape,
  modifiedShapes: Map<string, Shape>,
  shapes: Map<string, Shape>
): Map<string, Shape> => {
  const prevShape = getShape(s.prevShapeId, modifiedShapes, shapes);
  const nextShape = getShape(s.nextShapeId, modifiedShapes, shapes);
  if (prevShape && nextShape) {
    prevShape.nextShapeId = nextShape.id;
    nextShape.prevShapeId = prevShape.id;
    modifiedShapes.set(prevShape.id, prevShape);
    modifiedShapes.set(nextShape.id, nextShape);
  }
  return modifiedShapes;
};

const unlinkLastShape = (
  s: Shape,
  modifiedShapes: Map<string, Shape>,
  shapes: Map<string, Shape>
): Map<string, Shape> => {
  const newLastShape = getShape(s.prevShapeId, modifiedShapes, shapes);
  if (newLastShape) {
    newLastShape.nextShapeId = '';
    modifiedShapes.set(newLastShape.id, newLastShape);
  }
  return modifiedShapes;
};
