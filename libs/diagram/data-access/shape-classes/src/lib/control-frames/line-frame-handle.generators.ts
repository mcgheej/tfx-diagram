import { Point } from '@tfx-diagram/electron-renderer-web/shared-types';
import { LineControlPointReshaper, LineMidPointReshaper } from '../reshapers';
import { Handle } from '../shape-hierarchy/drawable-shapes/control-shapes/handle/handle';
import { Shape } from '../shape-hierarchy/shape';
import { HandleTypes } from '../types';

export const createLineControlPointHandle = (
  i: number,
  cp: Point[],
  associatedShapeId: string
): Handle => {
  const handleType: HandleTypes =
    i === 0
      ? 'connectorStart'
      : i === cp.length - 1
      ? 'connectorFinish'
      : 'notConnectorEnd';
  return new Handle({
    id: Shape.generateId(),
    x: cp[i].x,
    y: cp[i].y,
    handleStyle: 'square',
    pxWidth: 9,
    associatedShapeId,
    selectable: true,
    reshaper: new LineControlPointReshaper(),
    handleType,
  });
};

export const createLineMidPointHandle = (
  midPoint: Point,
  associatedShapeId: string
): Handle => {
  return new Handle({
    id: Shape.generateId(),
    x: midPoint.x,
    y: midPoint.y,
    handleStyle: 'square',
    pxWidth: 7,
    solid: true,
    associatedShapeId,
    selectable: true,
    cursor: 'crosshair',
    reshaper: new LineMidPointReshaper(),
  });
};
