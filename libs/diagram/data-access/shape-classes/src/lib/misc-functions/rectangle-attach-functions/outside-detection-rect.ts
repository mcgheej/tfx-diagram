import { pointInRect, rectInflate } from '@tfx-diagram/diagram/util/misc-functions';
import { Point } from '@tfx-diagram/electron-renderer-web/shared-types';
import { Rect } from '@tfx-diagram/shared-angular/utils/shared-types';
import { PX_BOUNDARY_DETECTION_THRESHOLD } from '../../types';

/**
 *
 * @param p - point to check
 * @param r - rectangle
 * @returns true is p is within r, else false
 */
export function outsideDetectionRect(p: Point, r: Rect): boolean {
  if (pointInRect(p, rectInflate(r, PX_BOUNDARY_DETECTION_THRESHOLD))) {
    return false;
  }
  return true;
}
