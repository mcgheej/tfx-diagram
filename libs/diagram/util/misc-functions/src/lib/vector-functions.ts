import { Point } from '@tfx-diagram/electron-renderer-web/shared-types';

export const vectorMagnitude = (v: Point): number => {
  return Math.sqrt(v.x ** 2 + v.y ** 2);
};

export const vectorMagnitudeSquared = (v: Point): number => {
  return v.x ** 2 + v.y ** 2;
};
