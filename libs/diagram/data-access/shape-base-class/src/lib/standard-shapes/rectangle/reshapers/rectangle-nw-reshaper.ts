import { rectEdges } from '@tfx-diagram/diagram/util/misc-functions';
import { GridProps, Point } from '@tfx-diagram/electron-renderer-web/shared-types';
import { Rect } from '@tfx-diagram/shared-angular/utils/shared-types';
import { gridSnapPoint } from '../../../misc-functions';
import { RectReshaper } from '../../../rect-reshaper';
import { Shape } from '../../../shape';
import { MIN_RECTANGLE_DIMENSION } from '../../../types';
import { Rectangle } from '../rectangle';

export class RectangleNwReshaper extends RectReshaper {
  /**
   *
   * @param newHandlePos
   * @param associatedShape
   *
   * @returns modified Rectangle object based on movement of north-west
   *          handle
   *
   */
  modifiedShape(newHandlePos: Point, associatedShape: Shape, gridProps: GridProps): Shape {
    const associatedRectangle = associatedShape as Rectangle;
    const newPos = gridSnapPoint(newHandlePos, gridProps);
    const newRect = this.nwReshape(newPos, {
      x: associatedRectangle.x,
      y: associatedRectangle.y,
      width: associatedRectangle.width,
      height: associatedRectangle.height,
    });

    return associatedRectangle.copy({
      x: newRect.x,
      y: newRect.y,
      width: newRect.width,
      height: newRect.height,
    });
  }

  private nwReshape(newPos: Point, rect: Rect): Rect {
    const { right, bottom } = rectEdges(rect);
    const left = Math.min(newPos.x, right - MIN_RECTANGLE_DIMENSION);
    const top = Math.min(newPos.y, bottom - MIN_RECTANGLE_DIMENSION);
    return { x: left, y: top, width: right - left, height: bottom - top };
  }
}
