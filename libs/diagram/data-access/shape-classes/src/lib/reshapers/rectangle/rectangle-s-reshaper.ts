import { rectEdges } from '@tfx-diagram/diagram/util/misc-functions';
import { GridProps, Point } from '@tfx-diagram/electron-renderer-web/shared-types';
import { Rect } from '@tfx-diagram/shared-angular/utils/shared-types';
import { gridSnapPoint } from '../../misc-functions';
import { Rectangle } from '../../shape-hierarchy/drawable-shapes/basic-shapes/rectangle/rectangle';
import { Shape } from '../../shape-hierarchy/shape';
import { MIN_RECTANGLE_DIMENSION } from '../../types';
import { RectReshaper } from '../rect-reshaper';

export class RectangleSReshaper extends RectReshaper {
  modifiedShape(
    newHandlePos: Point,
    associatedShape: Shape,
    gridProps: GridProps
  ): Shape {
    const associatedRectangle = associatedShape as Rectangle;
    const newPos = gridSnapPoint(newHandlePos, gridProps);
    const newRect = this.sReshape(newPos, {
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

  private sReshape(newPos: Point, rect: Rect): Rect {
    const { left, top, right } = rectEdges(rect);
    const bottom = Math.max(newPos.y, top + MIN_RECTANGLE_DIMENSION);
    return { x: left, y: top, width: right - left, height: bottom - top };
  }
}
