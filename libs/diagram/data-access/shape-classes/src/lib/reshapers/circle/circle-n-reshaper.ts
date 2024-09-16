import { GridProps, Point } from '@tfx-diagram/electron-renderer-web/shared-types';
import { gridSnapPoint } from '../../misc-functions';
import { Circle } from '../../shape-hierarchy/drawable-shapes/basic-shapes/circle/circle';
import { Shape } from '../../shape-hierarchy/shape';
import { MIN_CIRCLE_RADIUS } from '../../types';
import { RectReshaper } from '../rect-reshaper';

export class CircleNReshaper extends RectReshaper {
  modifiedShape(
    newHandlePos: Point,
    associatedShape: Shape,
    gridProps: GridProps
  ): Shape {
    const associatedCircle = associatedShape as Circle;
    const newPos = gridSnapPoint(newHandlePos, gridProps);
    return associatedCircle.copy({
      radius: this.nReshape(newPos, { x: associatedCircle.x, y: associatedCircle.y }),
    });
  }

  private nReshape(p: Point, c: Point): number {
    return Math.max(c.y - p.y, MIN_CIRCLE_RADIUS);
  }
}
