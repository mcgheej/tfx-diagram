import { GridProps, Point } from '@tfx-diagram/electron-renderer-web/shared-types';
import { Connection } from '../../../../../connections/connection';
import {
  calcBezierPoint,
  gridSnapPoint,
  lineInterpolate,
} from '../../../../../misc-functions';
import { Shape } from '../../../../shape';
import { Handle } from '../../../control-shapes/shapes/handle';
import { LineOutline } from '../../../control-shapes/shapes/line-outline';
import { Curve } from '../curve';
import { CurveEndpointReshaper } from './curve-endpoint-reshaper';

export class CurveFinalReshaper extends CurveEndpointReshaper {
  modifiedByConnection(curve: Curve, newPos: Point): Curve {
    const cp = [...curve.controlPoints];
    const end = cp.length - 1;
    cp[end - 1] = {
      x: cp[end - 1].x - (cp[end].x - newPos.x),
      y: cp[end - 1].y - (cp[end].y - newPos.y),
    };
    cp[end] = newPos;
    return curve.copy({ controlPoints: cp });
  }

  modifiedShape(
    newHandlePos: Point,
    associatedShape: Shape,
    gridProps: GridProps,
    handle: Handle,
    controlFrame: Shape[],
    connectionHook: Connection | null
  ): Shape {
    const associatedCurve = associatedShape as Curve;
    if (connectionHook && connectionHook.shapeId) {
      return associatedCurve.copy({
        controlPoints: this.reshape(newHandlePos, associatedCurve, handle, controlFrame),
      });
    }
    const newPos = gridSnapPoint(newHandlePos, gridProps);
    return associatedCurve.copy({
      controlPoints: this.reshape(newPos, associatedCurve, handle, controlFrame),
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
    if (controlFrame[2 * nSegments + cp.length - 1].id !== handle.id) {
      return cp;
    }
    const end = cp.length - 1;
    cp[end - 1] = {
      x: cp[end - 1].x - (cp[end].x - newHandlePos.x),
      y: cp[end - 1].y - (cp[end].y - newHandlePos.y),
    };
    cp[end] = newHandlePos;
    return cp;
  }

  private modify(cp: Point[], nSegments: number, controlFrame: Shape[]): Shape[] {
    const end = cp.length - 1;
    const p1 = lineInterpolate(cp[end - 1], cp[end], 0.5);
    const m = calcBezierPoint((nSegments - 1) * 3 + 1, cp, 0.5);
    const modifiedShapes = [
      (controlFrame[2 * nSegments - 1] as LineOutline).copy({
        controlPoints: [p1, cp[end]],
      }),
      (controlFrame[end - 1 + 2 * nSegments] as Handle).copy({ x: p1.x, y: p1.y }),
      (controlFrame[controlFrame.length - 1] as Handle).copy({ x: m.x, y: m.y }),
      (controlFrame[end + 2 * nSegments] as Handle).copy({ x: cp[end].x, y: cp[end].y }),
    ];
    return modifiedShapes;
  }
}
