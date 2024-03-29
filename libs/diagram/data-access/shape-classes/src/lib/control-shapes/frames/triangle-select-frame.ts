import { linkShapeArray, Shape } from '@tfx-diagram/diagram-data-access-shape-base-class';
import { Point } from '@tfx-diagram/electron-renderer-web/shared-types';
import { TriangleControlPointReshaper } from '../../standard-shapes/triangle/reshapers/triangle-control-point-reshaper';
import { Handle } from '../handle';
import { LineOutline } from '../line-outline';

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
