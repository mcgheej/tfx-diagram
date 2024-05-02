import {
  EMPTY_RECT,
  pointsBoundingBox,
  rectRotate,
} from '@tfx-diagram/diagram/util/misc-functions';
import { Point } from '@tfx-diagram/electron-renderer-web/shared-types';
import { Rect } from '@tfx-diagram/shared-angular/utils/shared-types';
import { Arc } from './arc';

export function calcArcBoundingBox(arc: Arc): Rect {
  // Normalise start and end angles such that arc
  // starts in the quadrant 0 (starts at 3 o'clock and
  // ends at 6 o'clock). First calculate the number of
  // quadrants to shift (0, 1, 2 or 3) required and
  // then adjust to give the normalised start and end
  // angles.
  const quadrantShift = Math.floor(arc.sAngle / 90);
  const sAngle = arc.sAngle - quadrantShift * 90;
  let eAngle = arc.eAngle - (arc.sAngle - sAngle);
  if (eAngle < 0) {
    eAngle = 360 + eAngle;
  }

  // Get the following points:
  //
  //  A: starting endpoint of the normalised arc
  //  B: ending endpoint of the normalised arc
  //  C: centre of arc's circle
  //  D: point at end of quadrant 0 (bottom of circle)
  //  E: point at end of quadrant 1 (left of circle)
  //  F: point at end of quadrant 2 (top of circle)
  const { a, b } = getArcEndpoints(arc.x, arc.y, arc.radius, sAngle, eAngle);
  const c: Point = { x: arc.x, y: arc.y };
  const d = { x: arc.x, y: arc.y + arc.radius };
  const e = { x: arc.x - arc.radius, y: arc.y };
  const f = { x: arc.x, y: arc.y - arc.radius };

  // Calculate the quadrant containing the normalised end point and
  // use this to determine the bounding rectangle for the
  // normalised arc
  const bQuadrant = Math.floor(eAngle / 90);
  if (bQuadrant === 0 && eAngle <= sAngle) {
    return {
      x: arc.x - arc.radius,
      y: arc.y - arc.radius,
      width: 2 * arc.radius,
      height: 2 * arc.radius,
    };
  }
  const cArray: Point[] = [];
  if (arc.circleSegment) {
    cArray.push(c);
  }
  switch (bQuadrant) {
    case 0: {
      return rectRotate(pointsBoundingBox([a, b, ...cArray]), quadrantShift * 90, {
        x: arc.x,
        y: arc.y,
      });
    }
    case 1: {
      return rectRotate(pointsBoundingBox([a, b, d, ...cArray]), quadrantShift * 90, {
        x: arc.x,
        y: arc.y,
      });
    }
    case 2: {
      return rectRotate(pointsBoundingBox([a, b, d, e, ...cArray]), quadrantShift * 90, {
        x: arc.x,
        y: arc.y,
      });
    }
    case 3: {
      return rectRotate(pointsBoundingBox([a, b, d, e, f]), quadrantShift * 90, {
        x: arc.x,
        y: arc.y,
      });
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
    a: {
      x: radius * Math.cos((sAngle * Math.PI) / 180) + x,
      y: radius * Math.sin((sAngle * Math.PI) / 180) + y,
    },
    b: {
      x: radius * Math.cos((eAngle * Math.PI) / 180) + x,
      y: radius * Math.sin((eAngle * Math.PI) / 180) + y,
    },
  };
}
