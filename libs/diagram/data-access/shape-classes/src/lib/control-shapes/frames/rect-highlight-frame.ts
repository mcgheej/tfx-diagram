import { linkShapeArray, Shape } from '@tfx-diagram/diagram-data-access-shape-base-class';
import { NopReshaper } from '@tfx-diagram/diagram-data-access-shape-reshapers';
import { Rect } from '@tfx-diagram/shared-angular/utils/shared-types';
import { Handle } from '../handle';

export const rectHighlightHandles = (rect: Rect, associatedShapeId: string): Shape[] => {
  let controlFrame: Shape[] = [
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
  controlFrame = linkShapeArray(controlFrame);
  return controlFrame;
};
