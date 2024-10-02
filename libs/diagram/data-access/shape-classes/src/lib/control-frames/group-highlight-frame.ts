import { Rect } from '@tfx-diagram/shared-angular/utils/shared-types';
import { Connection } from '../connections/connection';
import { linkShapeArray } from '../misc-functions';
import { RectangleOutline } from '../shape-hierarchy/drawable-shapes/control-shapes/rectangle-outline/rectangle-outline';
import { Shape } from '../shape-hierarchy/shape';
import { GROUP_OUTLINE_COLOR } from '../types';

export const groupHighlightFrame = (
  { x, y, width, height }: Rect,
  drawableShapes: Shape[] = [],
  shapes = new Map<string, Shape>(),
  connections = new Map<string, Connection>()
): Shape[] => {
  const frame: Shape[] = [];
  drawableShapes.map((s) => {
    frame.push(...s.highLightFrame(shapes, connections, true));
  });
  frame.push(
    new RectangleOutline({
      id: Shape.generateId(),
      x,
      y,
      width,
      height,
      strokeStyle: GROUP_OUTLINE_COLOR,
    })
  );
  return linkShapeArray(frame);
};
