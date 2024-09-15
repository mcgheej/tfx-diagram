import { GridProps, Point } from '@tfx-diagram/electron-renderer-web/shared-types';
import { gridSnapPoint } from '../../../../../misc-functions';
import { RectReshaper } from '../../../../../rect-reshaper';
import { MIN_CIRCLE_RADIUS } from '../../../../../types';
import { Shape } from '../../../../shape';
import { Circle } from '../circle';

export class CircleWReshaper extends RectReshaper {
  modifiedShape(
    newHandlePos: Point,
    associatedShape: Shape,
    gridProps: GridProps
  ): Shape {
    const associatedCircle = associatedShape as Circle;
    const newPos = gridSnapPoint(newHandlePos, gridProps);
    return associatedCircle.copy({
      radius: this.wReshape(newPos, { x: associatedCircle.x, y: associatedCircle.y }),
    });
  }

  private wReshape(p: Point, c: Point): number {
    return Math.max(c.x - p.x, MIN_CIRCLE_RADIUS);
  }
}
