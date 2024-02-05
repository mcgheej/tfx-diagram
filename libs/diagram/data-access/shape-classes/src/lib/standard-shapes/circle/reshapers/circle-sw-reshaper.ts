import { Shape } from '@tfx-diagram/diagram-data-access-shape-base-class';
import { GridProps, Point } from '@tfx-diagram/electron-renderer-web/shared-types';
import { gridSnapPoint } from '../../../misc-functions';
import { RectReshaper } from '../../../rect-reshaper';
import { MIN_CIRCLE_RADIUS } from '../../../types';
import { Circle } from '../circle';

export class CircleSwReshaper extends RectReshaper {
  modifiedShape(newHandlePos: Point, associatedShape: Shape, gridProps: GridProps): Shape {
    const associatedCircle = associatedShape as Circle;
    const newPos = gridSnapPoint(newHandlePos, gridProps);
    return associatedCircle.copy({
      radius: this.swReshape(newPos, { x: associatedCircle.x, y: associatedCircle.y }),
    });
  }

  private swReshape(p: Point, c: Point): number {
    return Math.max(Math.max(c.x - p.x, p.y - c.y), MIN_CIRCLE_RADIUS);
  }
}
