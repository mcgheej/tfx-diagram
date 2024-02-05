import { Connection, Shape } from '@tfx-diagram/diagram-data-access-shape-base-class';
import { Endpoint } from '@tfx-diagram/diagram/data-access/endpoint-classes';
import { ColorRef, FontProps } from '@tfx-diagram/electron-renderer-web/shared-types';

export const shapesFeatureKey = 'shapes';

export interface ShapesState {
  shapes: Map<string, Shape>;
  connections: Map<string, Connection>;
  copyBuffer: Shape[];
  pasteCount: number;
  movingConnectionIds: string[];
  lineColor: ColorRef;
  fillColor: ColorRef;
  lineWidth: number;
  lineDash: number[];
  startEndpoint: Endpoint | null;
  finishEndpoint: Endpoint | null;
  fontProps: FontProps;
}
