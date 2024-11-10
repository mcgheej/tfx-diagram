import {
  inverseTransform,
  pointInRect,
  pointOutsideRect,
  pointTransform,
  rectInflate,
  rectNormalised,
  vectorMagnitude,
} from '@tfx-diagram/diagram/util/misc-functions';
import {
  LineSegment,
  Point,
  Transform,
} from '@tfx-diagram/electron-renderer-web/shared-types';
import { Rect } from '@tfx-diagram/shared-angular/utils/shared-types';
import { Connection } from '../../connections/connection';
import { RectangleConnection } from '../../connections/derived-connections/rectangle-connection';
import { Rectangle } from '../../shape-hierarchy/drawable-shapes/basic-shapes/rectangle/rectangle';
import {
  LineAttachParams,
  PX_BOUNDARY_DETECTION_THRESHOLD,
  RectangleCornerArc,
} from '../../types';
import { checkLine } from '../line-attach-functions/check-line';

const INITIAL_ATTACH_DISTANCE = 10000;

export function attachRectangle(
  mousePx: Point,
  rectPx: Rect,
  lineWidthPx: number,
  rectangleId: string,
  connectionHook: Connection,
  t: Transform
): Connection | undefined {
  // Check if mouse is outside rectangle detection area
  let detectionArea = rectInflate(
    rectPx,
    PX_BOUNDARY_DETECTION_THRESHOLD + lineWidthPx / 2
  );
  if (pointOutsideRect(mousePx, detectionArea)) {
    return undefined;
  }

  // Get the perimiter data for the rectangle (local constant "p")
  const pathData = Rectangle.cachedPathData.get(rectangleId);
  if (pathData === undefined) {
    return undefined;
  }
  const { perimiter: p } = pathData;

  const factorX: number[] = [-1, 1, 1, -1];
  const factorY: number[] = [-1, -1, 1, 1];
  for (let i = 0; i < 8; i = i + 2) {
    if (p[i]) {
      const { x, y, r: radius } = p[i] as RectangleCornerArc;
      const { x: cx, y: cy } = pointTransform({ x, y }, t);
      const radiusPx = radius * t.scaleFactor;
      const cornerDetectionArea = rectNormalised(
        { x: cx, y: cy },
        {
          x: cx + (radiusPx + PX_BOUNDARY_DETECTION_THRESHOLD) * factorX[i / 2],
          y: cy + (radiusPx + PX_BOUNDARY_DETECTION_THRESHOLD) * factorY[i / 2],
        }
      );
      if (pointInRect(mousePx, cornerDetectionArea)) {
        // check if point near arc
        const d = Math.sqrt((mousePx.x - cx) ** 2 + (mousePx.y - cy) ** 2) - radiusPx;
        if (Math.abs(d) <= PX_BOUNDARY_DETECTION_THRESHOLD) {
          // attach to corner arc
          const v: Point = { x: mousePx.x - cx, y: mousePx.y - cy };
          const magV = vectorMagnitude(v);
          const u: Point = { x: v.x / magV, y: v.y / magV };
          const connectionPointPx: Point = {
            x: cx + u.x * radiusPx,
            y: cy + u.y * radiusPx,
          };
          return new RectangleConnection({
            id: connectionHook.id,
            connectorId: connectionHook.connectorId,
            end: connectionHook.end,
            shapeId: rectangleId,
            connectionPoint: inverseTransform(connectionPointPx, t),
            index: i,
            normalisedVector: u,
            k: 0,
          });
        }
      }
    }
  }

  // If the mouse position is not near the rectangle boundary then
  // bail out
  detectionArea = rectInflate(
    rectPx,
    -(PX_BOUNDARY_DETECTION_THRESHOLD + lineWidthPx / 2)
  );
  if (pointInRect(mousePx, detectionArea)) {
    return undefined;
  }

  let attachParams: LineAttachParams = {
    index: -1,
    shortestDistance: INITIAL_ATTACH_DISTANCE,
    k: 0,
    connectionPoint: { x: 0, y: 0 },
  };
  for (let i = 1; i < 8; i = i + 2) {
    if (p[i]) {
      const { a, b } = p[i] as LineSegment;
      attachParams = checkLine(
        i,
        mousePx,
        pointTransform(a, t),
        pointTransform(b, t),
        attachParams
      );
    }
  }
  if (attachParams.index > 0) {
    return new RectangleConnection({
      id: connectionHook.id,
      connectorId: connectionHook.connectorId,
      end: connectionHook.end,
      shapeId: rectangleId,
      connectionPoint: inverseTransform(attachParams.connectionPoint, t),
      index: attachParams.index,
      normalisedVector: { x: 0, y: 0 },
      k: attachParams.k,
    });
  }
  return undefined;
}
