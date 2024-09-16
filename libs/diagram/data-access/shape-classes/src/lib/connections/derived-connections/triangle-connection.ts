import { lineInterpolate } from '../../misc-functions';
import { Triangle } from '../../shape-hierarchy/drawable-shapes/basic-shapes/triangle/triangle';
import { Connector } from '../../shape-hierarchy/drawable-shapes/connectors/connector';
import { Shape } from '../../shape-hierarchy/shape';
import { Connection, ConnectionProps } from '../connection';

export interface TriangleConnectionProps extends ConnectionProps {
  index: number;
  k: number;
}

export type TriangleConnectionConfig = Omit<TriangleConnectionProps, 'connectionType'>;

export class TriangleConnection extends Connection implements TriangleConnectionProps {
  index: number;
  k: number;

  constructor(config: TriangleConnectionConfig) {
    super({ ...config, connectionType: 'triangleConnection' });
    this.index = config.index;
    this.k = config.k;
  }

  copy(a: Partial<TriangleConnectionProps>): TriangleConnection {
    return new TriangleConnection({
      id: a.id ?? this.id,
      connectorId: a.connectorId ?? this.connectorId,
      end: a.end ?? this.end,
      shapeId: a.shapeId ?? this.shapeId,
      connectionPoint: a.connectionPoint ?? this.connectionPoint,
      index: a.index ?? this.index,
      k: a.k ?? this.k,
    });
  }

  getProps(): TriangleConnectionProps {
    return {
      id: this.id,
      connectorId: this.connectorId,
      end: this.end,
      connectionType: 'triangleConnection',
      shapeId: this.shapeId,
      connectionPoint: this.connectionPoint,
      index: this.index,
      k: this.k,
    };
  }

  modifyConnectionPoint(t: Triangle): TriangleConnection {
    if (this.index === 0) {
      return this.copy({
        connectionPoint: lineInterpolate(t.vertices[0], t.vertices[1], this.k),
      });
    }
    if (this.index === 1) {
      return this.copy({
        connectionPoint: lineInterpolate(t.vertices[1], t.vertices[2], this.k),
      });
    }
    return this.copy({
      connectionPoint: lineInterpolate(t.vertices[2], t.vertices[0], this.k),
    });
  }

  reshapeConnector(connector: Connector): Shape {
    return connector.reshape(this.end, this.connectionPoint);
  }
}
