import { pointInRect, rectInflate } from '@tfx-diagram/diagram/util/misc-functions';
import { Point } from '@tfx-diagram/electron-renderer-web/shared-types';
import { Rect, RectSides } from '@tfx-diagram/shared-angular/utils/shared-types';
import { lineInterpolate } from '../../../../misc-functions';
import { PX_BOUNDARY_DETECTION_THRESHOLD } from '../../../../types';

export interface RectangleAttachParams {
  side: RectSides;
  shortestDistance: number;
  position: number; // [0..1]
  newP: Point;
}

/**
 *
 * @param p - point to check
 * @param r - rectangle
 * @returns true is p is within r, else false
 */
export const outsideDetectionRect = (p: Point, r: Rect): boolean => {
  if (pointInRect(p, rectInflate(r, PX_BOUNDARY_DETECTION_THRESHOLD))) {
    return false;
  }
  return true;
};

export const checkTopSide = (
  p: Point,
  r: Rect,
  { side, shortestDistance, position, newP }: RectangleAttachParams
): RectangleAttachParams => {
  if (pointInRect(p, rectInflate(r, PX_BOUNDARY_DETECTION_THRESHOLD))) {
    const d = Math.abs(r.y - p.y);
    if (d < shortestDistance) {
      // distance = d;
      let t = 0;
      if (p.x > r.x + r.width) {
        t = 1;
      } else if (p.x >= r.x) {
        t = (p.x - r.x) / r.width;
      }
      return {
        side: 'top',
        shortestDistance: d,
        position: t,
        newP: lineInterpolate({ x: r.x, y: r.y }, { x: r.x + r.width, y: r.y }, t),
      };
    }
  }
  return { side, shortestDistance, position, newP };
};

export const checkRightSide = (
  p: Point,
  r: Rect,
  { side, shortestDistance, position, newP }: RectangleAttachParams
): RectangleAttachParams => {
  if (pointInRect(p, rectInflate(r, PX_BOUNDARY_DETECTION_THRESHOLD))) {
    const d = Math.abs(r.x - p.x);
    if (d < shortestDistance) {
      let t = 0;
      if (p.y > r.y + r.height) {
        t = 1;
      } else if (p.y >= r.y) {
        t = (p.y - r.y) / r.height;
      }
      return {
        side: 'right',
        shortestDistance: d,
        position: t,
        newP: lineInterpolate({ x: r.x, y: r.y }, { x: r.x, y: r.y + r.height }, t),
      };
    }
  }
  return { side, shortestDistance, position, newP };
};

export const checkBottomSide = (
  p: Point,
  r: Rect,
  { side, shortestDistance, position, newP }: RectangleAttachParams
): RectangleAttachParams => {
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
};

export const checkLeftSide = (
  p: Point,
  r: Rect,
  { side, shortestDistance, position, newP }: RectangleAttachParams
): RectangleAttachParams => {
  if (pointInRect(p, rectInflate(r, PX_BOUNDARY_DETECTION_THRESHOLD))) {
    const d = Math.abs(r.x - p.x);
    if (d < shortestDistance) {
      let t = 0;
      if (p.y > r.y + r.height) {
        t = 1;
      } else if (p.y >= r.y) {
        t = (p.y - r.y) / r.height;
      }
      return {
        side: 'left',
        shortestDistance: d,
        position: t,
        newP: lineInterpolate({ x: r.x, y: r.y }, { x: r.x, y: r.y + r.height }, t),
      };
    }
  }
  return { side, shortestDistance, position, newP };
};
