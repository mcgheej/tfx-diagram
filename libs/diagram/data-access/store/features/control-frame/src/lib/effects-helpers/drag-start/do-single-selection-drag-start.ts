import { ControlFrameEffectsActions } from '@tfx-diagram/diagram-data-access-store-actions';
import { Connection, Group, Shape } from '@tfx-diagram/diagram/data-access/shape-classes';
import { getSubMap, inverseTransform } from '@tfx-diagram/diagram/util/misc-functions';
import { Point, Transform } from '@tfx-diagram/electron-renderer-web/shared-types';
import { of } from 'rxjs';
import { MovingConnectionsResult } from './moving-connections-result';

/**
 *
 * @param mousePos
 * @param transform
 * @param selectedShape
 * @param connections,
 * @param shapeSnap
 * @returns ControlFrameEffectsactions.dragStartSingleSelection
 */
export const doSingleSelectionDragStart = (
  mousePos: Point,
  transform: Transform,
  selectedShape: Shape,
  shapes: Map<string, Shape>,
  connections: Map<string, Connection>,
  shapeSnap: boolean,
) => {
  const dragOffset = selectedShape.dragOffset(
    inverseTransform(mousePos, transform),
    shapes,
  );
  let movingConnectionIds: string[] = [];
  let compromisedConnectionIds: string[] = [];

  if (selectedShape.shapeType === 'group') {
    const { movingConnectionIds: m, compromisedConnectionIds: c } = groupShapeStart(
      selectedShape as Group,
      shapes,
      connections,
      shapeSnap,
    );
    movingConnectionIds = m;
    compromisedConnectionIds = c;
  } else {
    const { movingConnectionIds: m, compromisedConnectionIds: c } = singleShapeStart(
      selectedShape,
      connections,
      shapeSnap,
    );
    movingConnectionIds = m;
    compromisedConnectionIds = c;
  }

  return of(
    ControlFrameEffectsActions.dragStartSingleSelection({
      selectedShape,
      dragOffset,
      frameShapes: selectedShape.outlineShapes(shapes),
      movingConnectionIds,
      compromisedConnectionIds,
    }),
  );
};

function singleShapeStart(
  selectedShape: Shape,
  connections: Map<string, Connection>,
  shapeSnap: boolean,
): MovingConnectionsResult {
  const movingConnectionIds: string[] = [];
  const compromisedConnectionIds: string[] = [];
  if (shapeSnap) {
    if (selectedShape.category() === 'connector') {
      // Any associated connections are compromised and must be
      // removed in the shapesReducer. The connectionId for
      // connections associated with a connector have the format
      // connectorId + '_connectorStart' or connectorId + '_connectorFinish'.
      // Assume both connections present as trying to delete them if they
      // don't exist doesn't do any harm.
      compromisedConnectionIds.push(selectedShape.id + '_connectorStart');
      compromisedConnectionIds.push(selectedShape.id + '_connectorFinish');
    } else if (selectedShape.category() === 'basic-shape') {
      // Must be a single basic shape so add any associated
      // connections to the moving connection list
      connections.forEach((connection) => {
        if (connection.shapeId === selectedShape.id) {
          movingConnectionIds.push(connection.id);
        }
      });
    }
  }
  return {
    movingConnectionIds,
    compromisedConnectionIds,
  };
}

function groupShapeStart(
  selectedGroup: Group,
  shapes: Map<string, Shape>,
  connections: Map<string, Connection>,
  shapeSnap: boolean,
): MovingConnectionsResult {
  const movingConnectionIds: string[] = [];
  const compromisedConnectionIds: string[] = [];

  if (shapeSnap) {
    const idsInGroup = Group.drawableShapeIds(selectedGroup, shapes);
    const selectedShapes = getSubMap(shapes, idsInGroup);
    connections.forEach((connection) => {
      const associatedShape = connection.getAssociatedShape(shapes);
      const associatedConnector = connection.getAssociatedConnector(shapes);
      if (associatedShape && selectedShapes.get(associatedShape.id)) {
        // The shape associated with this connection is in the selected group
        // therefore add it's id to the array of ids that reference
        // connections that need to move with this drag
        movingConnectionIds.push(connection.id);
      } else if (associatedConnector && selectedShapes.get(associatedConnector.id)) {
        // At this point the shape associated with this connection is not part
        // of the selected group but the associated connector is part of the
        // selected group. This means this connection is compromised as the
        // whole connector will move when the drag occurs
        compromisedConnectionIds.push(connection.id);
      }
    });
  }

  return {
    movingConnectionIds,
    compromisedConnectionIds,
  };
}
