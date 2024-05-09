import { Endpoint } from '@tfx-diagram/diagram/data-access/endpoint-classes';
import { ColorRef, PartPartial, Point } from '@tfx-diagram/electron-renderer-web/shared-types';
import { ShapeProps } from './shape-props';

export interface LineProps extends ShapeProps {
  controlPoints: Point[];
  lineDash: number[];
  lineWidth: number;
  strokeStyle: ColorRef;
  startEndpoint: Endpoint | null;
  finishEndpoint: Endpoint | null;
}

export type LineConfig = PartPartial<Omit<LineProps, 'shapeType'>, 'id'>;
