import { Rect } from '@tfx-diagram/shared-angular/utils/shared-types';
import { linkShapeArray } from '../../original-shape-misc-functions';
import { Shape } from '../../shape';
import { RectangularReshapersConfig } from '../../types/rectangular-reshapers-config';
import { Handle } from '../handle';
import { RectangleOutline } from '../rectangle-outline';

export const rectSelectFrame = (
  rect: Rect,
  associatedShapeId: string,
  reshapersConfig: RectangularReshapersConfig
): Shape[] => {
  const { x, y, width, height } = rect;
  let controlFrame: Shape[] = [
    new RectangleOutline({
      id: Shape.generateId(),
      x,
      y,
      width,
      height,
    }),
    new Handle({
      id: Shape.generateId(),
      x,
      y,
      handleStyle: 'square',
      associatedShapeId,
      selectable: true,
      cursor: 'move',
      reshaper: reshapersConfig.nwReshaper,
    }),
    new Handle({
      id: Shape.generateId(),
      x: x + width / 2,
      y,
      handleStyle: 'square',
      associatedShapeId,
      selectable: true,
      cursor: 'ns-resize',
      reshaper: reshapersConfig.nReshaper,
    }),
    new Handle({
      id: Shape.generateId(),
      x: x + width,
      y,
      handleStyle: 'square',
      associatedShapeId,
      selectable: true,
      cursor: 'move',
      reshaper: reshapersConfig.neReshaper,
    }),
    new Handle({
      id: Shape.generateId(),
      x: x + width,
      y: y + height / 2,
      handleStyle: 'square',
      associatedShapeId,
      selectable: true,
      cursor: 'ew-resize',
      reshaper: reshapersConfig.eReshaper,
    }),
    new Handle({
      id: Shape.generateId(),
      x: x + width,
      y: y + height,
      handleStyle: 'square',
      associatedShapeId,
      selectable: true,
      cursor: 'move',
      reshaper: reshapersConfig.seReshaper,
    }),
    new Handle({
      id: Shape.generateId(),
      x: x + width / 2,
      y: y + height,
      handleStyle: 'square',
      associatedShapeId,
      selectable: true,
      cursor: 'ns-resize',
      reshaper: reshapersConfig.sReshaper,
    }),
    new Handle({
      id: Shape.generateId(),
      x,
      y: y + height,
      handleStyle: 'square',
      associatedShapeId,
      selectable: true,
      cursor: 'move',
      reshaper: reshapersConfig.swReshaper,
    }),
    new Handle({
      id: Shape.generateId(),
      x,
      y: y + height / 2,
      handleStyle: 'square',
      associatedShapeId,
      selectable: true,
      cursor: 'ew-resize',
      reshaper: reshapersConfig.wReshaper,
    }),
  ];
  controlFrame = linkShapeArray(controlFrame);
  return controlFrame;
};
