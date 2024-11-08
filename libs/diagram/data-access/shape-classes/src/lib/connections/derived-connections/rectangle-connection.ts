import { LineSegment, Point } from '@tfx-diagram/electron-renderer-web/shared-types';
import { lineInterpolate } from '../../misc-functions';
import { Rectangle } from '../../shape-hierarchy/drawable-shapes/basic-shapes/rectangle/rectangle';
import { Connector } from '../../shape-hierarchy/drawable-shapes/connectors/connector';
import { Shape } from '../../shape-hierarchy/shape';
import { RectangleCornerArc } from '../../types';
import { Connection, ConnectionProps } from '../connection';

export interface RectangleConnectionProps extends ConnectionProps {
  index: number;
  normalisedVector: Point;
  k: number; // [0..1]
}

export type RectangleConnectionConfig = Omit<RectangleConnectionProps, 'connectionType'>;

export class RectangleConnection extends Connection implements RectangleConnectionProps {
  index: number;
  normalisedVector: Point;
  k: number;

  constructor(config: RectangleConnectionConfig) {
    super({ ...config, connectionType: 'rectangleConnection' });
    this.index = config.index;
    this.k = config.k;
    this.normalisedVector = config.normalisedVector;
  }

  copy(a: Partial<RectangleConnectionProps>): RectangleConnection {
    return new RectangleConnection({
      id: a.id ?? this.id,
      connectorId: a.connectorId ?? this.connectorId,
      end: a.end ?? this.end,
      shapeId: a.shapeId ?? this.shapeId,
      connectionPoint: a.connectionPoint ?? this.connectionPoint,
      index: a.index ?? this.index,
      normalisedVector: a.normalisedVector ?? this.normalisedVector,
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
      normalisedVector: this.normalisedVector,
      k: this.k,
    };
  }

  modifyConnectionPoint(r: Rectangle): RectangleConnection {
    const pathData = Rectangle.cachedPathData.get(r.id);
    if (pathData === undefined) {
      return this.copy({});
    }
    const { perimiter: p } = pathData;

    for (let i = 1; i < 8; i = i + 2) {
      if (this.index === i && p[i]) {
        return this.modifyConnectionPointOnLine(p[i] as LineSegment);
      }
    }

    for (let i = 0; i < 8; i = i + 2) {
      if (this.index === i && p[i]) {
        return this.modifyConnectionPointOnArc(p[i] as RectangleCornerArc);
      }
    }

    return this.copy({});
  }

  reshapeConnector(connector: Connector): Shape {
    return connector.reshape(this.end, this.connectionPoint);
  }

  private modifyConnectionPointOnLine({ a, b }: LineSegment): RectangleConnection {
    return this.copy({
      connectionPoint: lineInterpolate({ x: a.x, y: a.y }, { x: b.x, y: b.y }, this.k),
    });
  }

  private modifyConnectionPointOnArc({
    x,
    y,
    r,
  }: RectangleCornerArc): RectangleConnection {
    return this.copy({
      connectionPoint: {
        x: this.normalisedVector.x * r + x,
        y: this.normalisedVector.y * r + y,
      },
    });
  }
}
