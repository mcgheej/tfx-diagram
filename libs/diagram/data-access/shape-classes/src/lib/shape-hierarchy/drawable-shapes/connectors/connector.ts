import { Point } from '@tfx-diagram/electron-renderer-web/shared-types';
import { ConnectorEndTypes, ShapeCategory } from '../../../types';
import { DrawableShape } from '../drawable-shape';

export abstract class Connector extends DrawableShape {
  abstract reshape(end: ConnectorEndTypes, newPos: Point): Connector;

  override category(): ShapeCategory {
    return 'connector';
  }
}
