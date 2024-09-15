import { lineInterpolate } from '../misc-functions';
import { Connector } from '../shape-hierarchy/drawable-shapes/connectors/connector';
import { Shape } from '../shape-hierarchy/shape';
import { Rectangle } from '../standard-shapes/rectangle/rectangle';
import { Connection, ConnectionProps } from './connection';

export interface RectangleConnectionProps extends ConnectionProps {
  index: number;
  k: number; // [0..1]
}

export type RectangleConnectionConfig = Omit<RectangleConnectionProps, 'connectionType'>;

export class RectangleConnection extends Connection implements RectangleConnectionProps {
  index: number;
  k: number;

  constructor(config: RectangleConnectionConfig) {
    super({ ...config, connectionType: 'rectangleConnection' });
    this.index = config.index;
    this.k = config.k;
  }

  copy(a: Partial<RectangleConnectionProps>): RectangleConnection {
    return new RectangleConnection({
      id: a.id ?? this.id,
      connectorId: a.connectorId ?? this.connectorId,
      end: a.end ?? this.end,
      shapeId: a.shapeId ?? this.shapeId,
      connectionPoint: a.connectionPoint ?? this.connectionPoint,
      index: a.index ?? this.index,
      k: a.k ?? this.k,
    });
  }

  getProps(): RectangleConnectionProps {
    return {
      id: this.id,
      connectorId: this.connectorId,
      end: this.end,
      connectionType: 'rectangleConnection',
      shapeId: this.shapeId,
      connectionPoint: this.connectionPoint,
      index: this.index,
      k: this.k,
    };
  }

  modifyConnectionPoint(r: Rectangle): RectangleConnection {
    if (this.index === 0) {
      return this.copy({
        connectionPoint: lineInterpolate(
          { x: r.x, y: r.y },
          { x: r.x + r.width, y: r.y },
          this.k
        ),
      });
    }
    if (this.index === 1) {
      return this.copy({
        connectionPoint: lineInterpolate(
          { x: r.x + r.width, y: r.y },
          { x: r.x + r.width, y: r.y + r.height },
          this.k
        ),
      });
    }
    if (this.index === 2) {
      return this.copy({
        connectionPoint: lineInterpolate(
          { x: r.x + r.width, y: r.y + r.height },
          { x: r.x, y: r.y + r.height },
          this.k
        ),
      });
    }
    return this.copy({
      connectionPoint: lineInterpolate(
        { x: r.x, y: r.y + r.height },
        { x: r.x, y: r.y },
        this.k
      ),
    });
  }

  reshapeConnector(connector: Connector): Shape {
    return connector.reshape(this.end, this.connectionPoint);
  }
}
