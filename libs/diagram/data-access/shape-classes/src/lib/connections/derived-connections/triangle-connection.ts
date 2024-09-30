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
    const v = t.perimeterVertices;
    if (this.index === 0) {
      return this.copy({
        connectionPoint: lineInterpolate(v[0], v[1], this.k),
      });
    }
    if (this.index === 1) {
      return this.copy({
        connectionPoint: lineInterpolate(v[1], v[2], this.k),
      });
    }
    if (this.index === 2) {
      return this.copy({
        connectionPoint: lineInterpolate(v[2], v[3], this.k),
      });
    }
    if (this.index === 3) {
      return this.copy({
        connectionPoint: lineInterpolate(v[3], v[4], this.k),
      });
    }
    if (this.index === 4) {
      return this.copy({
        connectionPoint: lineInterpolate(v[4], v[5], this.k),
      });
    }
    return this.copy({
      connectionPoint: lineInterpolate(v[5], v[0], this.k),
    });
  }

  reshapeConnector(connector: Connector): Shape {
    return connector.reshape(this.end, this.connectionPoint);
  }
}
