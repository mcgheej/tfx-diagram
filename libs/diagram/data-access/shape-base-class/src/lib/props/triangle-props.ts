import {
  ColorRef,
  PartPartial,
  Point,
  TextBoxConfig,
} from '@tfx-diagram/electron-renderer-web/shared-types';
import { ShapeProps } from './shape-props';

export interface TriangleProps extends ShapeProps {
  vertices: [Point, Point, Point];
  lineDash: number[];
  lineWidth: number;
  strokeStyle: ColorRef;
  fillStyle: ColorRef;
  textConfig: TextBoxConfig;
}

export type TriangleConfig = PartPartial<Omit<TriangleProps, 'shapeType'>, 'id'>;
