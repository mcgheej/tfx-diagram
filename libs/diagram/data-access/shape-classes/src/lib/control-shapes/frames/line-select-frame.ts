import { Point } from '@tfx-diagram/electron-renderer-web/shared-types';
import { lineInterpolate } from '../../misc-functions';
import { linkShapeArray } from '../../original-shape-misc-functions';
import { Shape } from '../../shape';
import { Handle } from '../handle';
import {
  createLineControlPointHandle,
  createLineMidPointHandle,
} from './line-frame-handle.generators';

export const lineSelectFrame = (cp: Point[], associatedShapeId: string): Shape[] => {
  const frame: Shape[] = controlPointHandles(cp, associatedShapeId);
  frame.push(...midSegmentHandles(cp, associatedShapeId));
  linkShapeArray(frame);
  return frame;
};

const controlPointHandles = (cp: Point[], associatedShapeId: string): Handle[] => {
  const handles: Handle[] = [];
  for (let i = 0; i < cp.length; i++) {
    handles.push(createLineControlPointHandle(i, cp, associatedShapeId));
  }
  return handles;
};

const midSegmentHandles = (cp: Point[], associatedShapeId: string): Handle[] => {
  const handles: Handle[] = [];
  for (let i = 0; i < cp.length - 1; i++) {
    const midPoint = lineInterpolate(cp[i], cp[i + 1], 0.5);
    handles.push(createLineMidPointHandle(midPoint, associatedShapeId));
  }
  return handles;
};
