import { ColorRef, PartPartial, Point } from '@tfx-diagram/electron-renderer-web/shared-types';
import { ShapeProps } from './shape-props';
import { Endpoint } from '../endpoints';

export interface CurveProps extends ShapeProps {
  controlPoints: Point[];
  lineDash: number[];
  lineWidth: number;
  strokeStyle: ColorRef;
  startEndpoint: Endpoint | null;
  finishEndpoint: Endpoint | null;
}

export type CurveConfig = PartPartial<Omit<CurveProps, 'shapeType'>, 'id'>;
