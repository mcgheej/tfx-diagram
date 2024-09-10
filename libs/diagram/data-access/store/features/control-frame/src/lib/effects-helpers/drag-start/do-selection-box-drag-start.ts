import { ControlFrameEffectsActions } from '@tfx-diagram/diagram-data-access-store-actions';
import { RectangleOutline, Shape } from '@tfx-diagram/diagram/data-access/shape-classes';
import { inverseTransform } from '@tfx-diagram/diagram/util/misc-functions';
import { Point, Transform } from '@tfx-diagram/electron-renderer-web/shared-types';
import { of } from 'rxjs';

/**
 *
 * @param mousePos
 * @param transform
 * @returns ControlFrameEffectsActions.dragStartSelectionBox action
 *
 */
export const doSelectionBoxDragStart = (mousePos: Point, transform: Transform) => {
  const mousePagePos = inverseTransform(mousePos, transform);
  return of(
    ControlFrameEffectsActions.dragStartSelectionBox({
      mousePagePos,
      selectionBox: new RectangleOutline({
        id: Shape.generateId(),
        x: mousePagePos.x,
        y: mousePagePos.y,
        width: 0,
        height: 0,
      }),
    })
  );
};
