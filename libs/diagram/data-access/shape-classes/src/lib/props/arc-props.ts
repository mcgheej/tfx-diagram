import { ColorRef, PartPartial } from '@tfx-diagram/electron-renderer-web/shared-types';
import { ShapeProps } from './shape-props';

export interface ArcProps extends ShapeProps {
  x: number;
  y: number;
  radius: number;
  sAngle: number;
  eAngle: number;
  circleSegment: boolean;
  lineDash: number[];
  lineWidth: number;
  strokeStyle: ColorRef;
  fillStyle: ColorRef;
}

export type ArcConfig = PartPartial<Omit<ArcProps, 'shapeType'>, 'id'>;
