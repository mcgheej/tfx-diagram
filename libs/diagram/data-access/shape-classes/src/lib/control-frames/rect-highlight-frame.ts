import { Rect } from '@tfx-diagram/shared-angular/utils/shared-types';
import { Connection } from '../connections/connection';
import { linkShapeArray } from '../misc-functions';
import { NopReshaper } from '../reshapers';
import { ConnectionPoint } from '../shape-hierarchy/drawable-shapes/control-shapes/connection-point/connection-point';
import { Handle } from '../shape-hierarchy/drawable-shapes/control-shapes/handle/handle';
import { Shape } from '../shape-hierarchy/shape';

export function rectHighlightFrame(
  rect: Rect,
  associatedShapeId: string,
  connections: Map<string, Connection>
): Shape[] {
  let frame: Shape[] = [
    new Handle({
      id: Shape.generateId(),
      x: rect.x + rect.width / 2,
      y: rect.y,
      fillStyle: { colorSet: 'standard', ref: '1' },
      pxWidth: 9,
      associatedShapeId,
      reshaper: new NopReshaper(),
    }),
    new Handle({
      id: Shape.generateId(),
      x: rect.x + rect.width,
      y: rect.y + rect.height / 2,
      fillStyle: { colorSet: 'standard', ref: '1' },
      pxWidth: 9,
      associatedShapeId,
      reshaper: new NopReshaper(),
    }),
    new Handle({
      id: Shape.generateId(),
      x: rect.x + rect.width / 2,
      y: rect.y + rect.height,
      fillStyle: { colorSet: 'standard', ref: '1' },
      pxWidth: 9,
      associatedShapeId,
      reshaper: new NopReshaper(),
    }),
    new Handle({
      id: Shape.generateId(),
      x: rect.x,
      y: rect.y + rect.height / 2,
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
}
