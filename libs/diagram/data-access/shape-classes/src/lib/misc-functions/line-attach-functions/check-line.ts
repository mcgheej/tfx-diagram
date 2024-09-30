import {
  vectorDotProduct,
  vectorMagnitude,
  vectorMagnitudeSquared,
} from '@tfx-diagram/diagram/util/misc-functions';
import { Point } from '@tfx-diagram/electron-renderer-web/shared-types';
import { PX_BOUNDARY_DETECTION_THRESHOLD } from '../../types';
import { LineAttachParams } from '../../types/line-attach-params';

/**
 *
 * @param i - line segment index (for triangle this will be 0, 1 or 2)
 * @param p - check point (pixels), derived from current mouse position
 * @param a - start of line segment (pixels)
 * @param b - end of line segment (pixels)
 * @param param4 - line attach parameters (see above)
 * @returns - line attach params
 */
export function checkLine(
  i: number,
  p: Point,
  a: Point,
  b: Point,
  { index, shortestDistance, k: t, connectionPoint }: LineAttachParams
): LineAttachParams {
  // The line segment must be at least 3 pixels long to allow a
  // connection to be made. Check square of length and if shorter
  // than 3 squared do not proceed and simply return unchanged
  // line attach parameters
  const lSquared = vectorMagnitudeSquared({ x: b.x - a.x, y: b.y - a.y });
  if (lSquared > 9) {
    // Find point 'c' on line passing through points 'a' and 'b' that is
    // nearest to point 'p'.

    // Translate vectors 'ab' and 'ap' so 'a' is at origin, giving vectors
    // B and P respectively.
    const B: Point = { x: b.x - a.x, y: b.y - a.y };
    const P: Point = { x: p.x - a.x, y: p.y - a.y };

    // Calculate dot product of B and P vectors divided by dot product of B
    // with itself (lSquared).
    const k = vectorDotProduct(B, P) / lSquared;
    const C: Point = { x: k * B.x, y: k * B.y };
    let d = vectorMagnitude({ x: C.x - P.x, y: C.y - P.y });

    // For a connection option to this line segment 'd' must be less than the
    // detection threshold and shorter than any previous line segment connection
    // option as stored in the line attach parameters.
    if (d < shortestDistance && d < PX_BOUNDARY_DETECTION_THRESHOLD) {
      if (k < 0) {
        // The connection point is outside the line segment beyond 'a'. Check
        // distance to 'a' is less than detection threshold
        d = vectorMagnitude(C);
        if (d < shortestDistance && d < PX_BOUNDARY_DETECTION_THRESHOLD) {
          return { index: i, shortestDistance: d, k: 0, connectionPoint: a };
        }
      } else if (k > 1) {
        // The connection point is outside the line segment beyond 'b'. Check
        // distance to 'b' is less than detection threshold
        d = vectorMagnitude({ x: C.x - B.x, y: C.y - B.y });
        if (d < shortestDistance && d < PX_BOUNDARY_DETECTION_THRESHOLD) {
          return { index: i, shortestDistance: d, k: 1, connectionPoint: b };
        }
      } else {
        return {
          index: i,
          shortestDistance: d,
          k: k,
          connectionPoint: { x: C.x + a.x, y: C.y + a.y },
        };
      }
    }
  }
  return { index, shortestDistance, k: t, connectionPoint };
}
