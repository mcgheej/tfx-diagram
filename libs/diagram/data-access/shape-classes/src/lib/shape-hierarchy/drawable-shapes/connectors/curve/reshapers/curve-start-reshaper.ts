import { GridProps, Point } from '@tfx-diagram/electron-renderer-web/shared-types';
import { Connection } from '../../../../../connections/connection';
import { Handle } from '../../../../../control-shapes/handle';
import { LineOutline } from '../../../../../control-shapes/line-outline';
import {
  calcBezierPoint,
  gridSnapPoint,
  lineInterpolate,
} from '../../../../../misc-functions';
import { Shape } from '../../../../../shape';
import { Curve } from '../curve';
import { CurveEndpointReshaper } from './curve-endpoint-reshaper';

export class CurveStartReshaper extends CurveEndpointReshaper {
  modifiedByConnection(curve: Curve, newPos: Point): Curve {
    const cp = [...curve.controlPoints];
    cp[1] = {
      x: cp[1].x - (cp[0].x - newPos.x),
      y: cp[1].y - (cp[0].y - newPos.y),
    };
    cp[0] = { ...newPos };
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
  }

  private reshape(
    newHandlePos: Point,
    curve: Curve,
    handle: Handle,
    controlFrame: Shape[]
  ): Point[] {
    const cp = [...curve.controlPoints];
    const nSegments = Math.round((cp.length - 1) / 3);
    if (controlFrame[2 * nSegments].id !== handle.id) {
      return cp;
    }
    cp[1] = {
      x: cp[1].x - (cp[0].x - newHandlePos.x),
      y: cp[1].y - (cp[0].y - newHandlePos.y),
    };
    cp[0] = newHandlePos;
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
      (controlFrame[i] as Handle).copy({ x: cp[0].x, y: cp[0].y }),
    ];
    return modifiedShapes;
  }
}
