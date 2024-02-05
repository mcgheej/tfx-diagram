import { Connection, Shape } from '@tfx-diagram/diagram-data-access-shape-base-class';
import { getSubMap } from '@tfx-diagram/diagram/util/misc-functions';

export const getMovingConnectionIds = (
  ids: string[],
  shapes: Map<string, Shape>,
  connections: Map<string, Connection>,
  shapeSnap: boolean
): string[] => {
  const movingConnectionIds: string[] = [];
  // If snap-to-shape enabled find connections where the associated shape
  // is in the selection and the associated connector is not selected. Add
  // these to the moving connectors array. Note connections associated with
  // connectors included in the selection will be removed as part of the drag
  // start.
  if (shapeSnap) {
    const selectedShapesMap = getSubMap(shapes, ids);
    connections.forEach((connection) => {
      if (
        connectionShapeInSelection(connection, selectedShapesMap) &&
        connectionConnectorNotInSelection(connection, selectedShapesMap)
      ) {
        movingConnectionIds.push(connection.id);
      }
    });
  }
  return movingConnectionIds;
};

export const connectionShapeInSelection = (
  connection: Connection,
  selectedShapesMap: Map<string, Shape>
): boolean => {
  if (selectedShapesMap.get(connection.shapeId)) {
    return true;
  }
  return false;
};

export const connectionConnectorNotInSelection = (
  connection: Connection,
  selectedShapesMap: Map<string, Shape>
): boolean => {
  if (selectedShapesMap.get(connection.connectorId)) {
    return false;
  }
  return true;
};
