import { Connection, Shape } from '@tfx-diagram/diagram/data-access/shape-classes';
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
  // --------
  // Above comment may be out of date - new comment below
  // --------
  // If snap-to-shape enabled find connections where the associated shape
  // is in the selection and the associated connector has no other connection
  // to a shape outside the selection. Add these to the moving connectors array.
  // Note connections associated with connectors included in the selection that
  // have connections to shapes outside the selection will be removed as part
  // of the drag start.
  if (shapeSnap) {
    const selectedShapesMap = getSubMap(shapes, ids);
    connections.forEach((connection) => {
      if (
        connection.getAssociatedShape(selectedShapesMap) &&
        connectionConnectorNotInSelection(connection, selectedShapesMap)
      ) {
        movingConnectionIds.push(connection.id);
      }
      if (connection.getAssociatedShape(selectedShapesMap)) {
        const connector = connection.getAssociatedConnector(selectedShapesMap);
        if (connector) {
          // Connector is in selection as well. If the other end of the
          // connector is connected to a shape in the selection then add
          // this connection id to moving ids array, else this connection
          // needs to be flagged for removal
        } else {
          movingConnectionIds.push(connection.id);
        }
      }
    });
  }
  return movingConnectionIds;
};

const connectionConnectorNotInSelection = (
  connection: Connection,
  selectedShapesMap: Map<string, Shape>
): boolean => {
  if (selectedShapesMap.get(connection.connectorId)) {
    return false;
  }
  return true;
};
