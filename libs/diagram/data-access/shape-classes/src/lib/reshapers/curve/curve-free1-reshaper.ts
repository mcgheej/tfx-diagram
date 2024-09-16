import { GridProps, Point } from '@tfx-diagram/electron-renderer-web/shared-types';
import { calcBezierPoint, lineInterpolate } from '../../misc-functions';
import { Curve } from '../../shape-hierarchy/drawable-shapes/connectors/curve/curve';
import { Handle } from '../../shape-hierarchy/drawable-shapes/control-shapes/shapes/handle';
import { LineOutline } from '../../shape-hierarchy/drawable-shapes/control-shapes/shapes/line-outline';
import { Shape } from '../../shape-hierarchy/shape';
import { CurveNonEndpointReshaper } from './curve-non-endpoint-reshaper';

export class CurveFree1Reshaper extends CurveNonEndpointReshaper {
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
    return this.modify(cp, nSegments, controlFrame);
    // return curveModifySelectFrame((shape as Curve).controlPoints, controlFrame, handle);
  }

  private reshape(
    newHandlePos: Point,
    curve: Curve,
    handle: Handle,
    controlFrame: Shape[]
  ): Point[] {
    const cp = [...curve.controlPoints];
    const nSegments = Math.round((cp.length - 1) / 3);
    if (controlFrame[2 * nSegments + 1].id !== handle.id) {
      return cp;
    }
    cp[1] = lineInterpolate(cp[0], newHandlePos, 2);
    return cp;
  }

  private modify(cp: Point[], nSegments: number, controlFrame: Shape[]): Shape[] {
    const i = nSegments * 2;
    const p1 = lineInterpolate(cp[0], cp[1], 0.5);
    const m = calcBezierPoint(1, cp, 0.5);
    const modifiedShapes = [
      (controlFrame[0] as LineOutline).copy({ controlPoints: [cp[0], p1] }),
      (controlFrame[i + 1] as Handle).copy({ x: p1.x, y: p1.y }),
      (controlFrame[i + cp.length] as Handle).copy({ x: m.x, y: m.y }),
    ];
    return modifiedShapes;
  }
}
