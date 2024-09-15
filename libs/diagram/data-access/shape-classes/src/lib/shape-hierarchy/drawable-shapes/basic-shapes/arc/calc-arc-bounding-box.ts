import {
  EMPTY_RECT,
  pointAdd,
  pointFromPolarPoint,
  pointsBoundingBox,
  rectRotate,
} from '@tfx-diagram/diagram/util/misc-functions';
import { Point } from '@tfx-diagram/electron-renderer-web/shared-types';
import { Rect } from '@tfx-diagram/shared-angular/utils/shared-types';
// import { ArcOutline } from '../../control-shapes/arc-outline';
import { ArcOutline } from '../../../../control-shapes/arc-outline';
import { Arc } from './arc';

export function calcArcBoundingBox({
  x,
  y,
  radius,
  sAngle,
  eAngle,
  circleSegment,
}: Arc | ArcOutline): Rect {
  // Normalise start and end angles such that arc
  // starts in the quadrant 0 (starts at 3 o'clock and
  // ends at 6 o'clock). First calculate the number of
  // quadrants to shift (0, 1, 2 or 3) required and
  // then adjust to give the normalised start and end
  // angles.
  const quadrantShift = Math.floor(sAngle / 90) * 90;
  const sAngleDash = sAngle - quadrantShift;
  let eAngleDash = eAngle - (sAngle - sAngleDash);
  if (eAngleDash < 0) {
    eAngleDash = 360 + eAngleDash;
  }

  // Get the following points:
  //
  //  A: starting endpoint of the normalised arc
  //  B: ending endpoint of the normalised arc
  //  C: centre of arc's circle
  //  D: point at end of quadrant 0 (bottom of circle)
  //  E: point at end of quadrant 1 (left of circle)
  //  F: point at end of quadrant 2 (top of circle)
  const { a, b } = getArcEndpoints(x, y, radius, sAngleDash, eAngleDash);
  const c: Point = { x, y };
  const d = { x, y: y + radius };
  const e = { x: x - radius, y };
  const f = { x, y: y - radius };

  // Calculate the quadrant containing the normalised end point and
  // use this to determine the bounding rectangle for the
  // normalised arc
  const bQuadrant = Math.floor(eAngleDash / 90);
  if (bQuadrant === 0 && eAngleDash <= sAngleDash) {
    return {
      x: x - radius,
      y: y - radius,
      width: 2 * radius,
      height: 2 * radius,
    };
  }
  const cArray: Point[] = [];
  if (circleSegment) {
    cArray.push(c);
  }
  switch (bQuadrant) {
    case 0: {
      return rectRotate(
        pointsBoundingBox([a, b, ...cArray]),
        (quadrantShift * Math.PI) / 180,
        c
      );
    }
    case 1: {
      return rectRotate(
        pointsBoundingBox([a, b, d, ...cArray]),
        (quadrantShift * Math.PI) / 180,
        c
      );
    }
    case 2: {
      return rectRotate(
        pointsBoundingBox([a, b, d, e, ...cArray]),
        (quadrantShift * Math.PI) / 180,
        c
      );
    }
    case 3: {
      return rectRotate(
        pointsBoundingBox([a, b, d, e, f]),
        (quadrantShift * Math.PI) / 180,
        c
      );
    }
    default: {
      console.log('should never get here');
      break;
    }
  }
  return EMPTY_RECT;
}

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
