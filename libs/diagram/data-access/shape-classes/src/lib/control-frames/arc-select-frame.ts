import { pointAdd, pointFromPolarPoint } from '@tfx-diagram/diagram/util/misc-functions';
import { Point } from '@tfx-diagram/electron-renderer-web/shared-types';
import { linkShapeArray } from '../misc-functions';
import {
  ArcEangleReshaper,
  ArcRadiusReshaper,
  ArcSangleReshaper,
  Reshaper,
} from '../reshapers';
import { Arc } from '../shape-hierarchy/drawable-shapes/basic-shapes/arc/arc';
import { ArcOutline } from '../shape-hierarchy/drawable-shapes/control-shapes/arc-outline/arc-outline';
import { Handle } from '../shape-hierarchy/drawable-shapes/control-shapes/handle/handle';
import { LineOutline } from '../shape-hierarchy/drawable-shapes/control-shapes/line-outline/line-outline';
import { Shape } from '../shape-hierarchy/shape';
import { ARC_HANDLE_LENGTH } from '../types/constants';

/**
 * Arc Select Frame
 * ================
 * The select frame for an arc comprises the following parts:
 *
 * startHandleSpoke - LineOutline connecting arc centre to start angle
 *                    handle
 * endHandleSpoke   - LineOutline connecting arc centre to end angle
 *                    handle
 * arcOutline       - ArcOutline for arc
 * startHandle      - handle that controls start angle position
 * endHandle        - handle that controls end angle position
 * radiusHandle     - handle that controls the arc radius
 */

export const arcSelectFrame = (arc: Arc): Shape[] => {
  const { id, x, y, radius, sAngle, eAngle } = arc;
  const mAngle =
    eAngle >= sAngle
      ? (eAngle - sAngle) / 2 + sAngle
      : ((360 - sAngle + eAngle) / 2 + sAngle) % 360;
  const sPoint = pointAdd(
    { x, y },
    pointFromPolarPoint({ r: radius + ARC_HANDLE_LENGTH, a: sAngle })
  );
  const ePoint = pointAdd(
    { x, y },
    pointFromPolarPoint({ r: radius + ARC_HANDLE_LENGTH, a: eAngle })
  );
  const mPoint = pointAdd({ x, y }, pointFromPolarPoint({ r: radius, a: mAngle }));

  const frame: Shape[] = [
    createArcFrameSpoke({ x, y }, sPoint),
    createArcFrameSpoke({ x, y }, ePoint),
    createArcOutline(arc),
    createArcHandle(id, sPoint, new ArcSangleReshaper()),
    createArcHandle(id, ePoint, new ArcEangleReshaper()),
    createArcHandle(id, mPoint, new ArcRadiusReshaper()),
  ];
  linkShapeArray(frame);
  return frame;
};

const createArcFrameSpoke = (c: Point, p: Point): LineOutline => {
  return new LineOutline({
    id: Shape.generateId(),
    controlPoints: [c, p],
  });
};

const createArcOutline = ({ x, y, radius, sAngle, eAngle }: Arc): ArcOutline => {
  return new ArcOutline({
    id: Shape.generateId(),
    x,
    y,
    radius,
    sAngle,
    eAngle,
  });
};

const createArcHandle = (id: string, location: Point, reshaper: Reshaper): Handle => {
  return new Handle({
    id: Shape.generateId(),
    x: location.x,
    y: location.y,
    handleStyle: 'square',
    associatedShapeId: id,
    selectable: true,
    cursor: 'move',
    reshaper,
  });
};
