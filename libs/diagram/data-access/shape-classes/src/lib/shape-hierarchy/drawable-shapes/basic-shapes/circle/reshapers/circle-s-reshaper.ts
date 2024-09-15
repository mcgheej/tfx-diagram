import { GridProps, Point } from '@tfx-diagram/electron-renderer-web/shared-types';
import { gridSnapPoint } from '../../../../../misc-functions';
import { RectReshaper } from '../../../../../rect-reshaper';
import { MIN_CIRCLE_RADIUS } from '../../../../../types';
import { Shape } from '../../../../shape';
import { Circle } from '../circle';

export class CircleSReshaper extends RectReshaper {
  modifiedShape(
    newHandlePos: Point,
    associatedShape: Shape,
    gridProps: GridProps
  ): Shape {
    const associatedCircle = associatedShape as Circle;
    const newPos = gridSnapPoint(newHandlePos, gridProps);
    return associatedCircle.copy({
      radius: this.sReshape(newPos, { x: associatedCircle.x, y: associatedCircle.y }),
    });
  }

  private sReshape(p: Point, c: Point): number {
    return Math.max(p.y - c.y, MIN_CIRCLE_RADIUS);
  }
}
