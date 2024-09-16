import { Rect } from '@tfx-diagram/shared-angular/utils/shared-types';
import { GROUP_OUTLINE_COLOR } from '../../../../types';
import { Shape } from '../../../shape';
import { Group } from '../../../structural-shapes/group';
import { RectangleOutline } from '../shapes/rectangle-outline';

export const groupHighlightFrame = (
  group: Group,
  shapes: Map<string, Shape>,
  boundingBox: Rect
): Shape[] => {
  const { x, y, width, height } = boundingBox;
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
