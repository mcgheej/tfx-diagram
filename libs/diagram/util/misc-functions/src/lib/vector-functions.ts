import { Point } from '@tfx-diagram/electron-renderer-web/shared-types';

export const vectorMagnitude = (v: Point): number => {
  return Math.sqrt(v.x ** 2 + v.y ** 2);
};

export const vectorMagnitudeSquared = (v: Point): number => {
  return v.x ** 2 + v.y ** 2;
};

export function vectorDotProduct(v1: Point, v2: Point): number {
  return v1.x * v2.x + v1.y * v2.y;
}

/**
 *
 * @param v1
 * @param v2
 * @returns angle between the two vectors in radians
 */
export function vectorAngleBetween(v1: Point, v2: Point): number {
  const a = vectorMagnitude(v1);
  const b = vectorMagnitude(v2);
  return Math.acos(vectorDotProduct(v1, v2) / (a * b));
}

export function vectorCrossProductSignedMagnitude(v1: Point, v2: Point): number {
  return v1.x * v2.y - v1.y * v2.x;
}

export function vectorPerpendicularClockwise(v: Point): Point {
  return { x: v.y, y: -v.x };
}

export function vectorPerpendicularCounterClockwise(v: Point): Point {
  return { x: -v.y, y: v.x };
}
