import { Point } from '@tfx-diagram/electron-renderer-web/shared-types';
import { Circle } from '../../standard-shapes/circle/circle';
import { Connection, ConnectionProps } from '../../connection';
import { Connector } from '../../connector';
import { Shape } from '../../shape';

/**
 * theta - angle of vector from circle centre to connection point in radians
 */
export interface CircleConnectionProps extends ConnectionProps {
  normalisedVector: Point;
}

export type CircleConnectionConfig = Omit<CircleConnectionProps, 'connectionType'>;

export class CircleConnection extends Connection implements CircleConnectionProps {
  normalisedVector: Point;

  constructor(config: CircleConnectionConfig) {
    super({ ...config, connectionType: 'circleConnection' });
    this.normalisedVector = config.normalisedVector;
  }

  copy(a: Partial<CircleConnectionProps>): CircleConnection {
    return new CircleConnection({
      id: a.id ?? this.id,
      connectorId: a.connectorId ?? this.connectorId,
      end: a.end ?? this.end,
      shapeId: a.shapeId ?? this.shapeId,
      connectionPoint: a.connectionPoint ?? this.connectionPoint,
      normalisedVector: a.normalisedVector ?? this.normalisedVector,
    });
  }

  getProps(): CircleConnectionProps {
    return {
      id: this.id,
      connectorId: this.connectorId,
      end: this.end,
      connectionType: 'circleConnection',
      shapeId: this.shapeId,
      connectionPoint: this.connectionPoint,
      normalisedVector: this.normalisedVector,
    };
  }

  modifyConnectionPoint(shape: Circle): CircleConnection {
    return this.copy({
      connectionPoint: {
        x: this.normalisedVector.x * shape.radius + shape.x,
        y: this.normalisedVector.y * shape.radius + shape.y,
      },
    });
  }

  reshapeConnector(connector: Connector): Shape {
    return connector.reshape(this.end, this.connectionPoint);
  }
}
