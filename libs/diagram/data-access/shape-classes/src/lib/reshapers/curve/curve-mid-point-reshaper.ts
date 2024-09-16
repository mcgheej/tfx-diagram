import { GridProps, Point } from '@tfx-diagram/electron-renderer-web/shared-types';
import { calcBezierPoint, lineInterpolate } from '../../misc-functions';
import { Curve } from '../../shape-hierarchy/drawable-shapes/connectors/curve/curve';
import {
  createCurveControlPointHandle,
  createMidSegmentHandle,
} from '../../shape-hierarchy/drawable-shapes/control-shapes/frames/curve-frame-handle.generators';
import { getLineOutline } from '../../shape-hierarchy/drawable-shapes/control-shapes/frames/frame-line.generators';
import { Handle } from '../../shape-hierarchy/drawable-shapes/control-shapes/shapes/handle';
import { LineOutline } from '../../shape-hierarchy/drawable-shapes/control-shapes/shapes/line-outline';
import { Shape } from '../../shape-hierarchy/shape';
import { CurveLinkReshaper } from './curve-link-reshaper';
import { CurveNonEndpointReshaper } from './curve-non-endpoint-reshaper';

export class CurveMidPointReshaper extends CurveNonEndpointReshaper {
  modifiedShape(
    newHandlePos: Point,
    associatedShape: Shape,
    gridProps: GridProps,
    handle: Handle,
    controlFrame: Shape[]
  ): Shape {
    const associatedCurve = associatedShape as Curve;
    return associatedCurve.copy({
      controlPoints: this.reshape(associatedCurve, handle, controlFrame),
    });
  }

  modifiedControlFrame(shape: Shape, controlFrame: Shape[], handle: Handle): Shape[] {
    const cp = (shape as Curve).controlPoints;
    const nSegments = Math.round((cp.length - 1) / 3) - 1;
    const handleIdx = this.findHandleIndex(handle.id, controlFrame);
    if (handleIdx < nSegments * 5 + 1) {
      return [];
    }
    const segment = handleIdx - (nSegments * 5 + 1);
    return this.modify(segment, nSegments, cp, controlFrame);
  }

  private reshape(curve: Curve, handle: Handle, controlFrame: Shape[]): Point[] {
    const nSegments = Math.round((curve.controlPoints.length - 1) / 3);
    const handleIdx = this.findHandleIndex(handle.id, controlFrame);
    if (handleIdx < nSegments * 5 + 1) {
      return curve.controlPoints;
    }
    const segment = handleIdx - (nSegments * 5 + 1);
    return this.subDivideSegment(segment, curve.controlPoints);
  }

  /**
   *
   * @param s - zero-based index of the curve segment sub-divided
   * @param n - number of curve segments
   * @param cp - array of control points after sub-division
   * @param controlFrame - control frame
   * @returns - array of modified frame shapes
   */
  private modify(s: number, n: number, cp: Point[], controlFrame: Shape[]): Shape[] {
    const modifiedShapes = this.addNewLineOutlines(s, cp, controlFrame);
    modifiedShapes.push(...this.addNewControlPointHandles(s, n, cp, controlFrame));
    modifiedShapes.push(...this.addNewMidSegmentHandles(s, n, cp, controlFrame));
    return modifiedShapes;
  }

  /**
   *
   * @param s - zero-based index of the curve segment to sub-divide
   * @param cp - array of control points
   * @returns - array of modified control points
   *
   * When a mid-segment handle is moved by the user the application
   * responds by sub-dividing the curve segment associated with the
   * mid-segment handle. This function recomputes the control points
   * to sub-divide curve segment s.
   */
  private subDivideSegment(s: number, cp: Point[]): Point[] {
    // First get the four control points for the curve segment that
    // is being subdivided (A, P, Q, G)
    const [a, p, q, g] = cp.slice(s * 3, s * 3 + 4);

    // Next get points B and H that define the line joining the
    // mid-points of lines AP and PQ.
    const b = lineInterpolate(a, p, 0.5);
    const h = lineInterpolate(p, q, 0.5);

    // Get the point F that with H defines the line joining the
    // mid-points of lines PQ and QG.
    const f = lineInterpolate(q, g, 0.5);

    // Now get the points C and E that define the joining the
    // mid-points of lines BH and HF
    const c = lineInterpolate(b, h, 0.5);
    const e = lineInterpolate(h, f, 0.5);

    // Finally find the mid-point on the curve by finding point
    // D which lies at the middle of line CE.
    const d = lineInterpolate(c, e, 0.5);

    const r = cp.slice(0, s * 3);
    r.push(a, b, c, d, e, f);
    r.push(...cp.slice((s + 1) * 3));
    return r;
  }

  /**
   *
   * @param s - zero-based index for curve segment to be divided
   * @param cp - control points after sub-division
   * @param controlFrame - control frame prior to sub-division
   * @returns
   */
  private addNewLineOutlines(s: number, cp: Point[], controlFrame: Shape[]): Shape[] {
    // Start by creating two new LineOutline shapes that will join the
    // new pre-link and post-link handles to the link handle at the
    // sub-division join. Link them together ready for insertion in the
    // control frame linked list.
    const l1 = getLineOutline(s * 3 + 2, cp, Shape.generateId());
    const l2 = getLineOutline(s * 3 + 3, cp, Shape.generateId());
    l1.nextShapeId = l2.id;
    l2.prevShapeId = l1.id;

    // Now need to link the two new line outlines to the control
    // frame. Bear in mind the line outline preceding l1 and the
    // line outline following l2 also need to be adjusted to take
    // account of the new control point positions (points B and F).
    const a = cp[s * 3];
    const b = cp[s * 3 + 1];
    let handlePos = lineInterpolate(a, b, 0.5);
    const l0 = (controlFrame[s * 2] as LineOutline).copy({
      nextShapeId: l1.id,
      controlPoints: [{ ...a }, { ...a }, { ...handlePos }, { ...handlePos }],
    });

    const f = cp[s * 3 + 5];
    const g = cp[s * 3 + 6];
    handlePos = lineInterpolate(f, g, 0.5);
    const l3 = (controlFrame[s * 2 + 1] as LineOutline).copy({
      prevShapeId: l2.id,
      controlPoints: [{ ...handlePos }, { ...handlePos }, { ...g }, { ...g }],
    });
    l1.prevShapeId = l0.id;
    l2.nextShapeId = l3.id;

    // Return modified shapes
    return [l0, l1, l2, l3];
  }

  /**
   *
   * @param s - zero-based index for curve segment to be divided
   * @param n - number of curve segments prior to sub-division
   * @param cp - control points after sub-division
   * @param controlFrame - control frame prior to sub-division
   * @returns
   */
  private addNewControlPointHandles(
    s: number,
    n: number,
    cp: Point[],
    controlFrame: Shape[]
  ): Shape[] {
    // Get control point index for control point A and the associated
    // shape ID for this control frame
    const iA = s * 3;
    const associatedShapeId = (controlFrame[iA + 2 * n] as Handle).associatedShapeId;

    // Create new handles for control points C and E. Copy mid-segment
    // handle for original curve and convert to link handle at point D.
    // Finally link them up C <-> D <-> E.
    const c = createCurveControlPointHandle(iA + 2, cp, associatedShapeId);
    const e = createCurveControlPointHandle(iA + 4, cp, associatedShapeId);
    const d = (controlFrame[5 * n + 1 + s] as Handle).copy({
      x: cp[iA + 3].x,
      y: cp[iA + 3].y,
      pxWidth: 9,
      solid: false,
      cursor: 'move',
      reshaper: new CurveLinkReshaper(),
    });
    c.nextShapeId = d.id;
    d.nextShapeId = e.id;
    e.prevShapeId = d.id;
    d.prevShapeId = c.id;

    // Now amend handles for points B and F
    let handlePos = lineInterpolate(cp[iA], cp[iA + 1], 0.5);
    const b = (controlFrame[iA + 1 + 2 * n] as Handle).copy({
      x: handlePos.x,
      y: handlePos.y,
    });
    handlePos = lineInterpolate(cp[iA + 5], cp[iA + 6], 0.5);
    const f = (controlFrame[iA + 2 + 2 * n] as Handle).copy({
      x: handlePos.x,
      y: handlePos.y,
    });

    // Now link up with handles at points C, D, E such that
    // B <-> C <-> D <-> E <-> F
    b.nextShapeId = c.id;
    c.prevShapeId = b.id;
    e.nextShapeId = f.id;
    f.prevShapeId = e.nextShapeId;

    return [b, c, d, e, f];
  }
  /**
   *
   * @param s - zero-based index for curve segment to be divided
   * @param n - number of curve segments prior to sub-division
   * @param cp - control points after sub-division
   * @param controlFrame - control frame prior to sub-division
   * @returns
   */
  private addNewMidSegmentHandles(
    s: number,
    n: number,
    cp: Point[],
    controlFrame: Shape[]
  ): Shape[] {
    // Get control point index for control point A and the associated
    // shape ID for this control frame
    const iA = s * 3;
    const associatedShapeId = (controlFrame[2 * n] as Handle).associatedShapeId;

    // Get mid-segment handle of curve segment being sub-divided
    const h = controlFrame[5 * n + 1 + s] as Handle;

    // Create two new mid-segment handles for the subdivided curves.
    let midPoint = calcBezierPoint(iA + 1, cp, 0.5);
    const h1 = createMidSegmentHandle(midPoint, associatedShapeId);
    midPoint = calcBezierPoint(iA + 4, cp, 0.5);
    const h2 = createMidSegmentHandle(midPoint, associatedShapeId);
    h1.nextShapeId = h2.id;
    h2.prevShapeId = h1.id;

    // Link new mid-segment handles into control frame, removing the
    // mid-segment handle of the curve segment that was sub-divided
    const prevShape = (controlFrame[5 * n + s] as Handle).copy({
      nextShapeId: h1.id,
    });
    h1.prevShapeId = prevShape.id;
    let nextShape: Handle | null = null;
    if (h.nextShapeId) {
      h2.nextShapeId = h.nextShapeId;
      nextShape = (controlFrame[5 * n + 2 + s] as Handle).copy({
        prevShapeId: h2.id,
      });
    }
    const modifiedShapes: Shape[] = [prevShape, h1, h2];
    if (nextShape) {
      modifiedShapes.push(nextShape);
    }
    return modifiedShapes;
  }
}
