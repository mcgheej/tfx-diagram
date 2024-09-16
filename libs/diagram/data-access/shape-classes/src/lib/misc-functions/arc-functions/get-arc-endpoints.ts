import { pointAdd, pointFromPolarPoint } from '@tfx-diagram/diagram/util/misc-functions';
import { Point } from '@tfx-diagram/electron-renderer-web/shared-types';

export function getArcEndpoints(
  x: number,
  y: number,
  radius: number,
  sAngle: number,
  eAngle: number
): { a: Point; b: Point } {
  return {
    a: pointAdd({ x, y }, pointFromPolarPoint({ r: radius, a: sAngle })),
    b: pointAdd({ x, y }, pointFromPolarPoint({ r: radius, a: eAngle })),
  };
}
