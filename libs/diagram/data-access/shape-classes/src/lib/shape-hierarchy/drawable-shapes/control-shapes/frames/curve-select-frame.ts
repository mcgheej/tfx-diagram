import { Point } from '@tfx-diagram/electron-renderer-web/shared-types';
import {
  calcBezierPoint,
  lineInterpolate,
  linkShapeArray,
} from '../../../../misc-functions';
import { Shape } from '../../../shape';
import { Handle } from '../shapes/handle';
import { LineOutline } from '../shapes/line-outline';
import {
  createCurveControlPointHandle,
  createMidSegmentHandle,
} from './curve-frame-handle.generators';

export const curveSelectFrame = (cp: Point[], associatedShapeId: string): Shape[] => {
  const nSegments = Math.round((cp.length - 1) / 3);
  const frame: Shape[] = curveFrameLines(cp, nSegments);
  frame.push(...controlPointHandles(cp, associatedShapeId));
  frame.push(...midSegmentHandles(cp, associatedShapeId, nSegments));
  linkShapeArray(frame);
  return frame;
};

// ---------------------------------------------------------------

const curveFrameLines = (cp: Point[], nSegments: number): LineOutline[] => {
  const lines: LineOutline[] = [];
  for (let i = 0; i < nSegments; i++) {
    lines.push(...segmentLines(cp, i));
  }
  return lines;
};

const segmentLines = (cp: Point[], segment: number): LineOutline[] => {
  const p = cp.slice(segment * 3, segment * 3 + 4);
  const lines: LineOutline[] = [
    new LineOutline({
      id: Shape.generateId(),
      controlPoints: [p[0], lineInterpolate(p[0], p[1], 0.5)],
    }),
    new LineOutline({
      id: Shape.generateId(),
      controlPoints: [lineInterpolate(p[2], p[3], 0.5), p[3]],
    }),
  ];
  return lines;
};

// --------------------------------------------------------------

const controlPointHandles = (cp: Point[], associatedShapeId: string): Handle[] => {
  const handles: Handle[] = [];
  for (let i = 0; i < cp.length; i++) {
    handles.push(createCurveControlPointHandle(i, cp, associatedShapeId));
  }
  return handles;
};

// --------------------------------------------------------------
const midSegmentHandles = (
  cp: Point[],
  associatedShapeId: string,
  nSegments: number
): Handle[] => {
  const handles: Handle[] = [];
  for (let i = 0; i < nSegments; i++) {
    const p = cp.slice(i * 3, i * 3 + 4);
    const midPoint = calcBezierPoint(1, p, 0.5);
    handles.push(createMidSegmentHandle(midPoint, associatedShapeId));
  }
  return handles;
};
