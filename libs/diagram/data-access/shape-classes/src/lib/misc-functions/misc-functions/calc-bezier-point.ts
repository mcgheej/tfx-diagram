import { Point } from '@tfx-diagram/electron-renderer-web/shared-types';
import { calcBezierValue } from './calc-bezier-value';

export function calcBezierPoint(i: number, cp: Point[], t: number): Point {
  return {
    x: calcBezierValue(cp[i - 1].x, cp[i].x, cp[i + 1].x, cp[i + 2].x, t),
    y: calcBezierValue(cp[i - 1].y, cp[i].y, cp[i + 1].y, cp[i + 2].y, t),
  };
}
