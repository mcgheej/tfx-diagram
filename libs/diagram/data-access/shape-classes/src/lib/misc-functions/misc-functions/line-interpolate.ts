import { Point } from '@tfx-diagram/electron-renderer-web/shared-types';

/**
 *
 * @param p1 - first line endpoint
 * @param p2 - second line endpoint
 * @param t - interpolation point parameter
 * @returns - interpolated / extrapolated point
 *
 * The t parameter specifies the position of the interpolated (0 <= t <= 1)
 * or extrapolated (t > 1).
 */
export function lineInterpolate(p1: Point, p2: Point, t: number): Point {
  t = Math.abs(t);
  return {
    x: p1.x + (p2.x - p1.x) * t,
    y: p1.y + (p2.y - p1.y) * t,
  };
}
