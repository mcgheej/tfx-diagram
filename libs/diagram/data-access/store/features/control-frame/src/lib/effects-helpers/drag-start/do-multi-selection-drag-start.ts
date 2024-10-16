import { ControlFrameEffectsActions } from '@tfx-diagram/diagram-data-access-store-actions';
import {
  Connection,
  Shape,
  getDrawableShapeIdsInSelection,
} from '@tfx-diagram/diagram/data-access/shape-classes';
import { getSubMap, inverseTransform } from '@tfx-diagram/diagram/util/misc-functions';
import { Point, Transform } from '@tfx-diagram/electron-renderer-web/shared-types';
import { of } from 'rxjs';
import { MovingConnectionsResult } from './moving-connections-result';

/**
 *
 * @param mousePos
 * @param transform
 * @param selectedShapesIds
 * @param shapes
 * @returns ControlFrameEffectsActions.dragStartMultiSelection action or
 *          ControlFrameEffectsActions.frameChange action if no selected
 *          shapes found.
 */
export const doMultiSelectionDragStart = (
  mousePos: Point,
  transform: Transform,
  selectedShapeIds: string[],
  shapes: Map<string, Shape>,
  connections: Map<string, Connection>,
  shapeSnap: boolean
) => {
  if (selectedShapeIds.length > 0) {
    const s = shapes.get(selectedShapeIds[0]);
    if (s) {
      const mousePagePos = inverseTransform(mousePos, transform);
      const shapeIds = getDrawableShapeIdsInSelection(selectedShapeIds, shapes);
      const { movingConnectionIds, compromisedConnectionIds } = multiSelectionStart(
        shapeIds,
        shapes,
        connections,
        shapeSnap
      );
      return of(
        ControlFrameEffectsActions.dragStartMultiSelection({
          selectedShapeIds,
          dragOffset: s.dragOffset(mousePagePos, shapes),
          movingConnectionIds,
          compromisedConnectionIds,
        })
      );
    }
  }
  return of(ControlFrameEffectsActions.frameChange({ modifiedShapes: [] }));
};

function multiSelectionStart(
  idsInSelection: string[],
  shapes: Map<string, Shape>,
  connections: Map<string, Connection>,
  shapeSnap: boolean
): MovingConnectionsResult {
  const movingConnectionIds: string[] = [];
  const compromisedConnectionIds: string[] = [];

  if (shapeSnap) {
    const selectedShapes = getSubMap(shapes, idsInSelection);
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
