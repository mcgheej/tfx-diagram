import { polarPointFromPoint } from '@tfx-diagram/diagram/util/misc-functions';
import { GridProps, Point } from '@tfx-diagram/electron-renderer-web/shared-types';
import { Shape } from '../../../shape';
import { Arc } from '../arc';
import { ArcReshaper } from './arc.reshaper';

export class ArcEangleReshaper extends ArcReshaper {
  modifiedShape(newHandlePos: Point, associatedShape: Shape, gridProps: GridProps): Shape {
    const arc = associatedShape as Arc;
    let eAngle = polarPointFromPoint({
      x: newHandlePos.x - arc.x,
      y: newHandlePos.y - arc.y,
    }).a;
    if (gridProps.gridSnap) {
      eAngle = Math.round(eAngle);
    }
    return arc.copy({
      eAngle,
    });
  }
}