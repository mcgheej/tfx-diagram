import { Point } from '@tfx-diagram/electron-renderer-web/shared-types';
import { Connection } from '../connections/connection';
import { linkShapeArray } from '../misc-functions';
import { NopReshaper } from '../reshapers';
import { ConnectionPoint } from '../shape-hierarchy/drawable-shapes/control-shapes/connection-point/connection-point';
import { Handle } from '../shape-hierarchy/drawable-shapes/control-shapes/handle/handle';
import { Shape } from '../shape-hierarchy/shape';

export const triangleHighlightFrame = (
  vertices: [Point, Point, Point],
  associatedShapeId: string,
  connections: Map<string, Connection>
): Shape[] => {
  let frame: Shape[] = [
    new Handle({
      id: Shape.generateId(),
      x: vertices[0].x,
      y: vertices[0].y,
      fillStyle: { colorSet: 'standard', ref: '1' },
      pxWidth: 9,
      associatedShapeId,
      reshaper: new NopReshaper(),
    }),
    new Handle({
      id: Shape.generateId(),
      x: vertices[1].x,
      y: vertices[1].y,
      fillStyle: { colorSet: 'standard', ref: '1' },
      pxWidth: 9,
      associatedShapeId,
      reshaper: new NopReshaper(),
    }),
    new Handle({
      id: Shape.generateId(),
      x: vertices[2].x,
      y: vertices[2].y,
      fillStyle: { colorSet: 'standard', ref: '1' },
      pxWidth: 9,
      associatedShapeId,
      reshaper: new NopReshaper(),
    }),
  ];
  connections.forEach((connection) => {
    if (connection.shapeId === associatedShapeId) {
      frame.push(
        new ConnectionPoint({
          id: Shape.generateId(),
          x: connection.connectionPoint.x,
          y: connection.connectionPoint.y,
        })
      );
    }
  });
  frame = linkShapeArray(frame);
  return frame;
};
