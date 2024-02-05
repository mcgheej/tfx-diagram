import { Shape } from './shape';

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

export const getShapesArrayFromMapList = (
  startId: string,
  shapes: Map<string, Shape>
): Shape[] => {
  let id = startId;
  const shapeArray: Shape[] = [];
  while (id) {
    const shape = shapes.get(id);
    if (shape) {
      shapeArray.push(shape);
      id = shape.nextShapeId;
    } else {
      id = '';
    }
  }
  return shapeArray;
};

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

export const nextInChain = (id: string, shapes: Map<string, Shape>): Shape | undefined => {
  if (id) {
    return shapes.get(id);
  }
  return undefined;
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
