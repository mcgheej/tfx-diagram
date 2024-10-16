import { Point } from '@tfx-diagram/electron-renderer-web/shared-types';
import { Shape } from '../shape-hierarchy/shape';
import { ConnectorEndTypes } from '../types';
import { ConnectionTypes } from './connection-types';

export interface ConnectionProps {
  id: string;
  connectorId: string;
  end: ConnectorEndTypes;
  connectionType: ConnectionTypes;
  shapeId: string;
  connectionPoint: Point;
}

export abstract class Connection implements ConnectionProps {
  id: string;
  connectorId: string;
  end: 'connectorStart' | 'connectorFinish';
  connectionType: ConnectionTypes;
  shapeId: string;
  connectionPoint: Point;

  constructor(config: ConnectionProps) {
    this.id = config.id;
    this.connectorId = config.connectorId;
    this.end = config.end;
    this.connectionType = config.connectionType;
    this.shapeId = config.shapeId;
    this.connectionPoint = config.connectionPoint;
  }

  abstract copy(a: Partial<ConnectionProps>): Connection;
  abstract getProps(): ConnectionProps;
  abstract modifyConnectionPoint(shape: Shape): Connection;
  abstract reshapeConnector(connector: Shape): Shape;

  /**
   *
   * @param shapes - set of shapes to check
   *
   * Checks if the connection's associated shape is present in the
   * supplied Map of Shapes.
   */
  getAssociatedShape(shapes: Map<string, Shape>): Shape | undefined {
    return shapes.get(this.shapeId);
  }

  getAssociatedConnector(shapes: Map<string, Shape>): Shape | undefined {
    return shapes.get(this.connectorId);
  }
}
