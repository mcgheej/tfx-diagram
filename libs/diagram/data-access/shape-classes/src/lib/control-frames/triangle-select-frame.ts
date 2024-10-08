import { Point } from '@tfx-diagram/electron-renderer-web/shared-types';
import { linkShapeArray } from '../misc-functions';
import { TriangleControlPointReshaper } from '../reshapers';
import { Handle } from '../shape-hierarchy/drawable-shapes/control-shapes/handle/handle';
import { LineOutline } from '../shape-hierarchy/drawable-shapes/control-shapes/line-outline/line-outline';
import { Shape } from '../shape-hierarchy/shape';

export const triangleSelectFrame = (
  vertices: [Point, Point, Point],
  associatedShapeId: string
): Shape[] => {
  let controlFrame: Shape[] = [
    createLineOutline(vertices[0], vertices[1]),
    createLineOutline(vertices[1], vertices[2]),
    createLineOutline(vertices[2], vertices[0]),
  ];
  for (let i = 0; i < 3; i++) {
    controlFrame.push(createTriangleControlPoint(vertices[i], associatedShapeId));
  }
  controlFrame = linkShapeArray(controlFrame);
  return controlFrame;
};

const createLineOutline = (p1: Point, p2: Point): LineOutline => {
  return new LineOutline({
    id: Shape.generateId(),
    controlPoints: [p1, p2],
  });
};

const createTriangleControlPoint = (p: Point, associatedShapeId: string): Handle => {
  return new Handle({
    id: Shape.generateId(),
    x: p.x,
    y: p.y,
    handleStyle: 'square',
    pxWidth: 9,
    associatedShapeId,
    selectable: true,
    reshaper: new TriangleControlPointReshaper(),
  });
};
