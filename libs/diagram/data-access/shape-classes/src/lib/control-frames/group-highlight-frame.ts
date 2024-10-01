import { Rect } from '@tfx-diagram/shared-angular/utils/shared-types';
import { RectangleOutline } from '../shape-hierarchy/drawable-shapes/control-shapes/rectangle-outline/rectangle-outline';
import { Shape } from '../shape-hierarchy/shape';
import { GROUP_OUTLINE_COLOR } from '../types';

export const groupHighlightFrame = ({ x, y, width, height }: Rect): Shape[] => {
  return [
    new RectangleOutline({
      id: Shape.generateId(),
      x,
      y,
      width,
      height,
      strokeStyle: GROUP_OUTLINE_COLOR,
    }),
  ];
};
