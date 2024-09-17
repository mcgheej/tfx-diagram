import { ColorRef, PartPartial } from '@tfx-diagram/electron-renderer-web/shared-types';
import { Reshaper } from '../reshapers';
import { HandleStyle } from './handle-style.type';
import { HandleTypes } from './handle-types.type';
import { ShapeProps } from './shape-props';

export interface HandleProps extends ShapeProps {
  x: number;
  y: number;
  pxWidth: number;
  fillStyle: ColorRef;
  solid: boolean;
  handleStyle: HandleStyle;
  highlightOn: boolean;
  associatedShapeId: string;
  reshaper: Reshaper;
  handleType: HandleTypes;
}

export type HandleConfig = PartPartial<
  Omit<HandleProps, 'shapeType'>,
  'id' | 'x' | 'y' | 'reshaper'
>;
