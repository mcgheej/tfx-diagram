import { PartPartial } from '@tfx-diagram/electron-renderer-web/shared-types';
import { ShapeProps } from './shape-props';

export interface ConnectionPointProps extends ShapeProps {
  x: number;
  y: number;
}

export type ConnectionPointConfig = PartPartial<
  Omit<ConnectionPointProps, 'shapeType'>,
  'id' | 'x' | 'y'
>;
