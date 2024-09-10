import { Point } from '@tfx-diagram/electron-renderer-web/shared-types';
import { NopReshaper } from '../../reshaper/reshaper';
import { Shape } from '../../shape';
import { linkShapeArray } from '../../shape-misc-functions';
import { Handle } from '../handle';

export const triangleHighlightFrame = (
  vertices: [Point, Point, Point],
  associatedShapeId: string
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
  frame = linkShapeArray(frame);
  return frame;
};