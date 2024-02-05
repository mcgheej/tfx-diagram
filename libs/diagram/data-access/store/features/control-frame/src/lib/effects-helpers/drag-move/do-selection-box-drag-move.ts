import { Shape } from '@tfx-diagram/diagram-data-access-shape-base-class';
import { ControlFrameEffectsActions } from '@tfx-diagram/diagram-data-access-store-actions';
import { RectangleOutline } from '@tfx-diagram/diagram/data-access/shape-classes';
import { inverseTransform } from '@tfx-diagram/diagram/util/misc-functions';
import { Point, Transform } from '@tfx-diagram/electron-renderer-web/shared-types';
import { of } from 'rxjs';

export const doSelectionBoxDragMove = (
  mousePos: Point,
  transform: Transform,
  selectionBoxAnchor: Point,
  selectionFrameStart: string,
  controlShapes: Map<string, Shape>
) => {
  const rectOutline = controlShapes.get(selectionFrameStart) as RectangleOutline;
  if (rectOutline) {
    const mousePagePos = inverseTransform(mousePos, transform as Transform);
    const x = Math.min(mousePagePos.x, selectionBoxAnchor.x);
    const y = Math.min(mousePagePos.y, selectionBoxAnchor.y);
    const width = Math.abs(mousePagePos.x - selectionBoxAnchor.x);
    const height = Math.abs(mousePagePos.y - selectionBoxAnchor.y);
    return of(
      ControlFrameEffectsActions.dragMoveSelectionBox({
        selectionBox: rectOutline.copy({ x, y, width, height }),
      })
    );
  }
  return of(ControlFrameEffectsActions.frameChange({ modifiedShapes: [] }));
};
