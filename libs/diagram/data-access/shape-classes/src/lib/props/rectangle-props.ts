import {
  ColorRef,
  PartPartial,
  TextBoxConfig,
} from '@tfx-diagram/electron-renderer-web/shared-types';
import { ShapeProps } from './shape-props';

export interface RectangleProps extends ShapeProps {
  x: number;
  y: number;
  width: number;
  height: number;
  corners: string;
  lineDash: number[];
  lineWidth: number;
  strokeStyle: ColorRef;
  fillStyle: ColorRef;
  textConfig: TextBoxConfig;
}

export type RectangleConfig = PartPartial<Omit<RectangleProps, 'shapeType'>, 'id'>;
