import { Shape } from '@tfx-diagram/diagram-data-access-shape-base-class';
import { pointsDistance } from '@tfx-diagram/diagram/util/misc-functions';
import { GridProps, Point } from '@tfx-diagram/electron-renderer-web/shared-types';
import { gridSnapPoint } from '../../../misc-functions';
import { MIN_CIRCLE_RADIUS } from '../../../types/constants';
import { Arc } from '../arc';
import { ArcReshaper } from './arc.reshaper';

export class ArcRadiusReshaper extends ArcReshaper {
  modifiedShape(newHandlePos: Point, associatedShape: Shape, gridProps: GridProps): Shape {
    const associatedArc = associatedShape as Arc;
    const newPos = gridSnapPoint(newHandlePos, gridProps);
    return associatedArc.copy({
      radius: this.calcRadius(newPos, { x: associatedArc.x, y: associatedArc.y }),
    });
  }

  private calcRadius(p: Point, c: Point): number {
    return Math.max(pointsDistance(p, c), MIN_CIRCLE_RADIUS);
  }
}
