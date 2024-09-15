import { Point } from '@tfx-diagram/electron-renderer-web/shared-types';
import { ConnectorEndTypes } from './connections/connection';
import { Shape } from './shape';

export abstract class Connector extends Shape {
  abstract reshape(end: ConnectorEndTypes, newPos: Point): Connector;

  override category(): string {
    return 'connector';
  }
}
