import {
  Connection,
  Shape,
  getShape,
} from '@tfx-diagram/diagram/data-access/shape-classes';

export const getModifiedConnections = (
  movingConnectionIds: string[],
  connections: Map<string, Connection>,
  shapes: Map<string, Shape>,
  modifiedShapes: Map<string, Shape>
): Connection[] => {
  const modifiedConnections: Connection[] = [];
  if (movingConnectionIds.length > 0) {
    movingConnectionIds.map((id) => {
      const connection = connections.get(id);
      if (connection) {
        const connector = getShape(connection.connectorId, modifiedShapes, shapes, false);
        const modifiedShape = modifiedShapes.get(connection.shapeId);
        if (modifiedShape && connector && connector.category() === 'connector') {
          const modifiedConnection = connection.modifyConnectionPoint(modifiedShape);
          modifiedConnections.push(modifiedConnection);
          const modifiedConnector = modifiedConnection.reshapeConnector(connector);
          modifiedShapes.set(modifiedConnector.id, modifiedConnector);
        }
      }
    });
  }
  return modifiedConnections;
};
