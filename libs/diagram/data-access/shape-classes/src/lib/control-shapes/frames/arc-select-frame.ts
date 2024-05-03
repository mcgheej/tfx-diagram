import { Shape, linkShapeArray } from '@tfx-diagram/diagram-data-access-shape-base-class';
import { pointAdd, pointFromPolarCoords } from '@tfx-diagram/diagram/util/misc-functions';
import { Point } from '@tfx-diagram/electron-renderer-web/shared-types';
import { NopReshaper, Reshaper } from '../../reshaper';
import { Arc } from '../../standard-shapes/arc/arc';
import { ArcOutline } from '../arc-outline';
import { Handle } from '../handle';
import { LineOutline } from '../line-outline';

export const arcSelectFrame = (arc: Arc): Shape[] => {
  const { id, x, y, radius, sAngle, eAngle } = arc;
  const mAngle =
    eAngle >= sAngle
      ? (eAngle - sAngle) / 2 + sAngle
      : ((360 - sAngle + eAngle) / 2 + sAngle) % 360;
  const sPoint = pointAdd({ x, y }, pointFromPolarCoords(radius + 5, sAngle));
  const ePoint = pointAdd({ x, y }, pointFromPolarCoords(radius + 5, eAngle));
  const mPoint = pointAdd({ x, y }, pointFromPolarCoords(radius, mAngle));
  const frame: Shape[] = arcFrameLines({ x, y }, sPoint, ePoint);
  frame.push(arcOutline(arc));
  frame.push(createArcHandle(id, sPoint, new NopReshaper()));
  frame.push(createArcHandle(id, ePoint, new NopReshaper()));
  frame.push(createArcHandle(id, mPoint, new NopReshaper()));
  linkShapeArray(frame);
  return frame;
};

const arcFrameLines = (c: Point, sPoint: Point, ePoint: Point): LineOutline[] => {
  return [
    new LineOutline({
      id: Shape.generateId(),
      controlPoints: [c, sPoint],
    }),
    new LineOutline({
      id: Shape.generateId(),
      controlPoints: [c, ePoint],
    }),
  ];
};

const arcOutline = ({ x, y, radius, sAngle, eAngle }: Arc): ArcOutline => {
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
