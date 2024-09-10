import { ColorRef, PartPartial, Point } from '@tfx-diagram/electron-renderer-web/shared-types';
import { ShapeProps } from './shape-props';
import { Endpoint } from '../endpoints';

export interface LineProps extends ShapeProps {
  controlPoints: Point[];
  lineDash: number[];
  lineWidth: number;
  strokeStyle: ColorRef;
  startEndpoint: Endpoint | null;
  finishEndpoint: Endpoint | null;
}

export type LineConfig = PartPartial<Omit<LineProps, 'shapeType'>, 'id'>;
