import { Shape } from '@tfx-diagram/diagram-data-access-shape-base-class';
import { GridProps, Point } from '@tfx-diagram/electron-renderer-web/shared-types';
import { Handle } from '../../../control-shapes/handle';
import { LineOutline } from '../../../control-shapes/line-outline';
import { calcBezierPoint, lineInterpolate } from '../../../misc-functions';
import { Curve } from '../curve';
import { CurveNonEndpointReshaper } from './curve-non-endpoint-reshaper';

export class CurveFree2Reshaper extends CurveNonEndpointReshaper {
  modifiedShape(
    newHandlePos: Point,
    associatedShape: Shape,
    gridProps: GridProps,
    handle: Handle,
    controlFrame: Shape[]
  ): Shape {
    const associatedCurve = associatedShape as Curve;
    return associatedCurve.copy({
      controlPoints: this.reshaper(newHandlePos, associatedCurve, handle, controlFrame),
    });
  }

  modifiedControlFrame(shape: Shape, controlFrame: Shape[], handle: Handle): Shape[] {
    const handleIdx = this.findHandleIndex(handle.id, controlFrame);
    if (handleIdx < 0) {
      return [];
    }
    const cp = (shape as Curve).controlPoints;
    const nSegments = Math.round((cp.length - 1) / 3);
    return this.modify(cp, nSegments, controlFrame);
    // return curveModifySelectFrame((shape as Curve).controlPoints, controlFrame, handle);
  }

  private reshaper(
    newHandlePos: Point,
    curve: Curve,
    handle: Handle,
    controlFrame: Shape[]
  ): Point[] {
    const cp = [...curve.controlPoints];
    const nSegments = Math.round((cp.length - 1) / 3);
    const handleIdx = nSegments * 2 + cp.length - 2;
    if (controlFrame[handleIdx].id !== handle.id) {
      return cp;
    }
    const endCpIdx = cp.length - 1;
    cp[endCpIdx - 1] = lineInterpolate(cp[endCpIdx], newHandlePos, 2);
    return cp;
  }

  private modify(cp: Point[], nSegments: number, controlFrame: Shape[]): Shape[] {
    const end = cp.length - 1;
    const p1 = lineInterpolate(cp[end - 1], cp[end], 0.5);
    const m = calcBezierPoint((nSegments - 1) * 3 + 1, cp, 0.5);
    const modifiedShapes = [
      (controlFrame[2 * nSegments - 1] as LineOutline).copy({ controlPoints: [p1, cp[end]] }),
      (controlFrame[end - 1 + 2 * nSegments] as Handle).copy({ x: p1.x, y: p1.y }),
      (controlFrame[controlFrame.length - 1] as Handle).copy({ x: m.x, y: m.y }),
    ];
    return modifiedShapes;
  }
}
