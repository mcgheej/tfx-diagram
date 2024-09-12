import { Point } from '@tfx-diagram/electron-renderer-web/shared-types';

/**
 *
 * @param p1 - point that has moved
 * @param p2 - origin of rotation
 * @param p3 - point to realign
 */
export function realignPoint(p1: Point, p2: Point, p3: Point): Point {
  // Calculate the square of the distance from the origin of rotation
  // to the point to realign
  const a = p3.x - p2.x;
  const b = p3.y - p2.y;
  const dPower2 = a * a + b * b;

  // Calculate the absolute x and y offsets for the new position
  // of p3, relative to p2, that will realign it with p1 and p2
  let x = 0;
  let y = 0;
  if (p1.x === p2.x) {
    x = 0;
    y = Math.sqrt(dPower2);
  } else {
    const m = (p1.y - p2.y) / (p1.x - p2.x);
    x = Math.sqrt(dPower2 / (m * m + 1));
    y = Math.abs(m * x);
  }

  // Based on the position of p1 to p2 realign p3 using the absolute
  // offsets calculated
  if (p1.x < p2.x && p1.y < p2.y) {
    x = p2.x + x;
    y = p2.y + y;
  } else if (p1.x >= p2.x && p1.y < p2.y) {
    x = p2.x - x;
    y = p2.y + y;
  } else if (p1.x >= p2.x && p1.y >= p2.y) {
    x = p2.x - x;
    y = p2.y - y;
  } else {
    x = p2.x + x;
    y = p2.y - y;
  }

  return {
    x,
    y,
  };
}
