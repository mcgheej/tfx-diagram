import { rectEdges } from '@tfx-diagram/diagram/util/misc-functions';
import { GridProps, Point } from '@tfx-diagram/electron-renderer-web/shared-types';
import { Rect } from '@tfx-diagram/shared-angular/utils/shared-types';
import { gridSnapPoint } from '../../misc-functions';
import { Rectangle } from '../../shape-hierarchy/drawable-shapes/basic-shapes/rectangle/rectangle';
import { Shape } from '../../shape-hierarchy/shape';
import { MIN_RECTANGLE_DIMENSION } from '../../types';
import { RectReshaper } from '../rect-reshaper';

export class RectangleNeReshaper extends RectReshaper {
  modifiedShape(
    newHandlePos: Point,
    associatedShape: Shape,
    gridProps: GridProps
  ): Shape {
    const associatedRectangle = associatedShape as Rectangle;
    const newPos = gridSnapPoint(newHandlePos, gridProps);
    const newRect = this.neReshape(newPos, {
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

  private neReshape(newPos: Point, rect: Rect): Rect {
    const { left, bottom } = rectEdges(rect);
    const top = Math.min(newPos.y, bottom - MIN_RECTANGLE_DIMENSION);
    const right = Math.max(newPos.x, left + MIN_RECTANGLE_DIMENSION);
    return { x: left, y: top, width: right - left, height: bottom - top };
  }
}
