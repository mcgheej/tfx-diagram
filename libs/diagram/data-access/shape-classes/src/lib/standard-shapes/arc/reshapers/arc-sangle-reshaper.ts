import { Shape } from '@tfx-diagram/diagram-data-access-shape-base-class';
import { polarPointFromPoint } from '@tfx-diagram/diagram/util/misc-functions';
import { Point } from '@tfx-diagram/electron-renderer-web/shared-types';
import { Arc } from '../arc';
import { ArcReshaper } from './arc.reshaper';

export class ArcSangleReshaper extends ArcReshaper {
  modifiedShape(newHandlePos: Point, associatedShape: Shape): Shape {
    const arc = associatedShape as Arc;
    return arc.copy({
      sAngle: polarPointFromPoint({ x: newHandlePos.x - arc.x, y: newHandlePos.y - arc.y }).a,
    });
  }
}
