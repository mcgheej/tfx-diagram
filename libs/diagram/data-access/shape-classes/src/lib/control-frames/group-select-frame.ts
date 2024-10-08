import { Rect } from '@tfx-diagram/shared-angular/utils/shared-types';
import { linkShapeArray } from '../misc-functions';
import { NopReshaper } from '../reshapers';
import { Handle } from '../shape-hierarchy/drawable-shapes/control-shapes/handle/handle';
import { RectangleOutline } from '../shape-hierarchy/drawable-shapes/control-shapes/rectangle-outline/rectangle-outline';
import { Shape } from '../shape-hierarchy/shape';
import { GROUP_OUTLINE_COLOR } from '../types';

export const groupSelectFrame = (rect: Rect): Shape[] => {
  const { x, y, width, height } = rect;
  const controlFrame: Shape[] = [
    new RectangleOutline({
      id: Shape.generateId(),
      x,
      y,
      width,
      height,
      strokeStyle: GROUP_OUTLINE_COLOR,
    }),
    new Handle({
      id: Shape.generateId(),
      x,
      y,
      handleStyle: 'square',
      selectable: false,
      cursor: 'default',
      solid: true,
      fillStyle: GROUP_OUTLINE_COLOR,
      reshaper: new NopReshaper(),
    }),
    new Handle({
      id: Shape.generateId(),
      x: x + width,
      y,
      handleStyle: 'square',
      selectable: false,
      cursor: 'default',
      solid: true,
      fillStyle: GROUP_OUTLINE_COLOR,
      reshaper: new NopReshaper(),
    }),
    new Handle({
      id: Shape.generateId(),
      x: x + width,
      y: y + height,
      handleStyle: 'square',
      selectable: false,
      cursor: 'default',
      solid: true,
      fillStyle: GROUP_OUTLINE_COLOR,
      reshaper: new NopReshaper(),
    }),
    new Handle({
      id: Shape.generateId(),
      x,
      y: y + height,
      handleStyle: 'square',
      selectable: false,
      cursor: 'default',
      solid: true,
      fillStyle: GROUP_OUTLINE_COLOR,
      reshaper: new NopReshaper(),
    }),
  ];
  return linkShapeArray(controlFrame);
};
