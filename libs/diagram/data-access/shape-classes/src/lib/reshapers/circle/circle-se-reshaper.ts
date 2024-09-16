import { GridProps, Point } from '@tfx-diagram/electron-renderer-web/shared-types';
import { gridSnapPoint } from '../../misc-functions';
import { Circle } from '../../shape-hierarchy/drawable-shapes/basic-shapes/circle/circle';
import { Shape } from '../../shape-hierarchy/shape';
import { MIN_CIRCLE_RADIUS } from '../../types';
import { RectReshaper } from '../rect-reshaper';

export class CircleSeReshaper extends RectReshaper {
  modifiedShape(
    newHandlePos: Point,
    associatedShape: Shape,
    gridProps: GridProps
  ): Shape {
    const associatedCircle = associatedShape as Circle;
    const newPos = gridSnapPoint(newHandlePos, gridProps);
    return associatedCircle.copy({
      radius: this.seReshape(newPos, { x: associatedCircle.x, y: associatedCircle.y }),
    });
  }

  private seReshape(p: Point, c: Point): number {
    return Math.max(Math.max(p.x - c.x, p.y - c.y), MIN_CIRCLE_RADIUS);
  }
}
