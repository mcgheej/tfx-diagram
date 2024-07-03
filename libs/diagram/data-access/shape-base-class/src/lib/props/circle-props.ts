import {
  ColorRef,
  PartPartial,
  TextBoxConfig,
} from '@tfx-diagram/electron-renderer-web/shared-types';
import { ShapeProps } from './shape-props';

export interface CircleProps extends ShapeProps {
  x: number;
  y: number;
  radius: number;
  lineDash: number[];
  lineWidth: number;
  strokeStyle: ColorRef;
  fillStyle: ColorRef;
  textConfig: TextBoxConfig;
}

export type CircleConfig = PartPartial<Omit<CircleProps, 'shapeType'>, 'id'>;
