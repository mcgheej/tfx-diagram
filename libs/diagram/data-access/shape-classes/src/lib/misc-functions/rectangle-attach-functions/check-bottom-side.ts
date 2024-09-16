import { pointInRect, rectInflate } from '@tfx-diagram/diagram/util/misc-functions';
import { Point } from '@tfx-diagram/electron-renderer-web/shared-types';
import { Rect } from '@tfx-diagram/shared-angular/utils/shared-types';
import { PX_BOUNDARY_DETECTION_THRESHOLD, RectangleAttachParams } from '../../types';
import { lineInterpolate } from '../misc-functions';

export function checkBottomSide(
  p: Point,
  r: Rect,
  { side, shortestDistance, position, newP }: RectangleAttachParams
): RectangleAttachParams {
  if (pointInRect(p, rectInflate(r, PX_BOUNDARY_DETECTION_THRESHOLD))) {
    const d = Math.abs(r.y - p.y);
    if (d < shortestDistance) {
      let t = 0;
      if (p.x > r.x + r.width) {
        t = 1;
      } else if (p.x >= r.x) {
        t = (p.x - r.x) / r.width;
      }
      return {
        side: 'bottom',
        shortestDistance: d,
        position: t,
        newP: lineInterpolate({ x: r.x, y: r.y }, { x: r.x + r.width, y: r.y }, t),
      };
    }
  }
  return { side, shortestDistance, position, newP };
}
