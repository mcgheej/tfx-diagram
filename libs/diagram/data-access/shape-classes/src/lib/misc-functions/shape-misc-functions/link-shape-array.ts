import { Shape } from '../../shape-hierarchy/shape';

/**
 *
 * @param shapes - array of shapes to link
 * @returns same array of shapes but now linked
 *
 * Constructs a double linked list in the supplied 'shapes' array.
 *
 * Simply works through the supplied array setting the previous and
 * next id links to link the shapes togather.
 */
export function linkShapeArray(shapes: Shape[]): Shape[] {
  const l = shapes.length;
  if (l === 0) {
    return shapes;
  }

  shapes[0].prevShapeId = '';
  for (let i = 1; i < l; i++) {
    shapes[i - 1].nextShapeId = shapes[i].id;
    shapes[i].prevShapeId = shapes[i - 1].id;
  }
  shapes[l - 1].nextShapeId = '';

  return shapes;
}

export function linkShapeArray2(shapes: Shape[]): Shape[] {
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
}
