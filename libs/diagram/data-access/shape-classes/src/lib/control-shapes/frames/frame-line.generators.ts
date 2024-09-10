import { Point } from '@tfx-diagram/electron-renderer-web/shared-types';
import { LineOutline } from '../line-outline';

/**
 *
 * @param i: index to control point at start of line
 * @param cp: curve control points
 * @param id: id for LineOutline shape
 * @returns: LineOutline object that will render a line between the
 * handle positions for the control points at cp[i] and cp[i+1]
 */
export const getLineOutline = (i: number, cp: Point[], id: string): LineOutline => {
  const ep = getLineEndPoints(i, cp);
  return new LineOutline({
    id,
    controlPoints: [{ ...ep[0] }, { ...ep[0] }, { ...ep[1] }, { ...ep[1] }],
  });
};

/**
 *
 * @param i: index to control point used to start line
 * @param cp: curve control points
 * @returns: a Point array containing the handle locations
 * for the line endpoints
 */
const getLineEndPoints = (i: number, cp: Point[]): Point[] => {
  let p0 = { x: 0, y: 0 };
  let p1 = { x: 0, y: 0 };
  switch (i % 3) {
    case 0: {
      p0 = { x: cp[i].x, y: cp[i].y };
      p1 = {
        x: (cp[i + 1].x - cp[i].x) / 2 + cp[i].x,
        y: (cp[i + 1].y - cp[i].y) / 2 + cp[i].y,
      };
      break;
    }
    case 2: {
      p0 = {
        x: (cp[i + 1].x - cp[i].x) / 2 + cp[i].x,
        y: (cp[i + 1].y - cp[i].y) / 2 + cp[i].y,
      };
      p1 = { x: cp[i + 1].x, y: cp[i + 1].y };
      break;
    }
  }
  return [p0, p1];
};
