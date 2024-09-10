import { GridProps, Point } from '@tfx-diagram/electron-renderer-web/shared-types';
import { Handle } from '../../../control-shapes/handle';
import { LineOutline } from '../../../control-shapes/line-outline';
import { calcBezierPoint, lineInterpolate, realignPoint } from '../../../misc-functions';
import { Shape } from '../../../shape';
import { Curve } from '../curve';
import { CurveNonEndpointReshaper } from './curve-non-endpoint-reshaper';

export class CurvePrelinkReshaper extends CurveNonEndpointReshaper {
  modifiedShape(
    newHandlePos: Point,
    associatedShape: Shape,
    gridProps: GridProps,
    handle: Handle,
    controlFrame: Shape[]
  ): Shape {
    const associatedCurve = associatedShape as Curve;
    return associatedCurve.copy({
      controlPoints: this.reshape(newHandlePos, associatedCurve, handle, controlFrame),
    });
  }

  modifiedControlFrame(shape: Shape, controlFrame: Shape[], handle: Handle): Shape[] {
    const handleIdx = this.findHandleIndex(handle.id, controlFrame);
    if (handleIdx < 0) {
      return [];
    }
    const cp = (shape as Curve).controlPoints;
    const nSegments = Math.round((cp.length - 1) / 3);
    return this.modify(cp, nSegments, controlFrame, handleIdx);
  }

  private reshape(
    newHandlePos: Point,
    curve: Curve,
    handle: Handle,
    controlFrame: Shape[]
  ): Point[] {
    const handleIdx = this.findHandleIndex(handle.id, controlFrame);
    if (handleIdx < 0) {
      return curve.controlPoints;
    }
    const cp = [...curve.controlPoints];
    const nSegments = Math.round((cp.length - 1) / 3);
    const cpIdx = handleIdx - 2 * nSegments;
    cp[cpIdx + 2] = realignPoint(newHandlePos, cp[cpIdx + 1], cp[cpIdx + 2]);
    cp[cpIdx] = lineInterpolate(cp[cpIdx + 1], newHandlePos, 2);
    return cp;
  }

  private modify(
    cp: Point[],
    nSegments: number,
    controlFrame: Shape[],
    handleIdx: number
  ): Shape[] {
    const cpBase = 2 * nSegments;
    const cpIdx = handleIdx - cpBase;
    const segment = Math.round((cpIdx + 1) / 3) - 1;
    const modifiedShapes: Shape[] = [];

    // Modify the pre-link handle
    let hPos = lineInterpolate(cp[cpIdx + 1], cp[cpIdx], 0.5);
    modifiedShapes.push(
      (controlFrame[cpBase + cpIdx] as Handle).copy({ x: hPos.x, y: hPos.y })
    );
    const preLinkLine = controlFrame[segment * 2 + 1] as LineOutline;
    modifiedShapes.push(
      preLinkLine.copy({ controlPoints: [{ ...hPos }, { ...cp[cpIdx + 1] }] })
    );

    // Modify the post-link handle
    hPos = lineInterpolate(cp[cpIdx + 1], cp[cpIdx + 2], 0.5);
    modifiedShapes.push(
      (controlFrame[cpBase + cpIdx + 2] as Handle).copy({ x: hPos.x, y: hPos.y })
    );
    const postLinkLine = controlFrame[segment * 2 + 2] as LineOutline;
    modifiedShapes.push(
      postLinkLine.copy({ controlPoints: [{ ...cp[cpIdx + 1] }, { ...hPos }] })
    );

    // Modify the mid-segment handle for the curve segment that contains
    // pre-link control point
    let midPoint = calcBezierPoint(cpIdx - 1, cp, 0.5);
    modifiedShapes.push(
      (controlFrame[5 * nSegments + 1 + (cpIdx + 1) / 3 - 1] as Handle).copy({
        x: midPoint.x,
        y: midPoint.y,
      })
    );

    // Modify the mid-segment handle for the curve segment that contains
    // post-link control point
    midPoint = calcBezierPoint(cpIdx + 2, cp, 0.5);
    modifiedShapes.push(
      (controlFrame[5 * nSegments + 1 + (cpIdx + 1) / 3] as Handle).copy({
        x: midPoint.x,
        y: midPoint.y,
      })
    );

    return modifiedShapes;
  }
}
