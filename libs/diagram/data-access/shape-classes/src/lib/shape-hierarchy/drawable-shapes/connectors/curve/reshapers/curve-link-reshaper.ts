import { GridProps, Point } from '@tfx-diagram/electron-renderer-web/shared-types';
import { Handle } from '../../../../../control-shapes/handle';
import { LineOutline } from '../../../../../control-shapes/line-outline';
import { calcBezierPoint, lineInterpolate } from '../../../../../misc-functions';
import { Shape } from '../../../../../shape';
import { Curve } from '../curve';
import { CurveNonEndpointReshaper } from './curve-non-endpoint-reshaper';

export class CurveLinkReshaper extends CurveNonEndpointReshaper {
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
      return [];
    }
    const cp = [...curve.controlPoints];
    const nSegments = Math.round((cp.length - 1) / 3);
    const cIdx = handleIdx - 2 * nSegments;
    cp[cIdx - 1] = {
      x: cp[cIdx - 1].x - (cp[cIdx].x - newHandlePos.x),
      y: cp[cIdx - 1].y - (cp[cIdx].y - newHandlePos.y),
    };
    cp[cIdx + 1] = {
      x: cp[cIdx + 1].x - (cp[cIdx].x - newHandlePos.x),
      y: cp[cIdx + 1].y - (cp[cIdx].y - newHandlePos.y),
    };
    cp[cIdx] = newHandlePos;
    return cp;
  }

  private modify(
    cp: Point[],
    nSegments: number,
    controlFrame: Shape[],
    handleIdx: number
  ): Shape[] {
    const cpIdx = handleIdx - 2 * nSegments;
    const segment = Math.round(cpIdx / 3) - 1;
    const p1 = lineInterpolate(cp[cpIdx - 1], cp[cpIdx], 0.5);
    const p2 = lineInterpolate(cp[cpIdx], cp[cpIdx + 1], 0.5);

    const preLinkLine = controlFrame[segment * 2 + 1] as LineOutline;
    const postLinkLine = controlFrame[segment * 2 + 2] as LineOutline;
    const modifiedShapes: Shape[] = [
      preLinkLine.copy({ controlPoints: [p1, { ...cp[cpIdx] }] }),
      postLinkLine.copy({ controlPoints: [{ ...cp[cpIdx] }, p2] }),
    ];

    modifiedShapes.push(
      (controlFrame[handleIdx - 1] as Handle).copy({ x: p1.x, y: p1.y })
    );
    modifiedShapes.push(
      (controlFrame[handleIdx] as Handle).copy({ x: cp[cpIdx].x, y: cp[cpIdx].y })
    );
    modifiedShapes.push(
      (controlFrame[handleIdx + 1] as Handle).copy({ x: p2.x, y: p2.y })
    );

    const m1 = calcBezierPoint(segment * 3 + 1, cp, 0.5);
    const m2 = calcBezierPoint((segment + 1) * 3 + 1, cp, 0.5);
    const mIdx = segment + 2 * nSegments + cp.length;
    modifiedShapes.push((controlFrame[mIdx] as Handle).copy({ x: m1.x, y: m1.y }));
    modifiedShapes.push((controlFrame[mIdx + 1] as Handle).copy({ x: m2.x, y: m2.y }));

    return modifiedShapes;
  }
}
