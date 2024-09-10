import { ControlFrameEffectsActions } from '@tfx-diagram/diagram-data-access-store-actions';
import {
  CircleConnection,
  Connection,
  Handle,
  Shape,
  getShapeArrayFromMapList,
} from '@tfx-diagram/diagram/data-access/shape-classes';
import { inverseTransform } from '@tfx-diagram/diagram/util/misc-functions';
import { Point, Transform } from '@tfx-diagram/electron-renderer-web/shared-types';
import { of } from 'rxjs';

export const doHandleDragStart = (
  mousePos: Point,
  transform: Transform,
  highlightedShapeId: string,
  connections: Map<string, Connection>,
  selectionFrameStart: string,
  controlShapes: Map<string, Shape>,
  shapeSnap: boolean
) => {
  const mousePagePos = inverseTransform(mousePos, transform);
  const handle = controlShapes.get(highlightedShapeId) as Handle;
  if (handle && handle.shapeType === 'handle') {
    const controlFrame = getShapeArrayFromMapList(selectionFrameStart, controlShapes);
    if (handle.handleType === 'notConnectorEnd' || !shapeSnap) {
      // Reshaping a shape not a connector so if snap-to-shape enabled find
      // connections associated with the shape
      const movingConnectionIds: string[] = [];
      if (shapeSnap) {
        connections.forEach((connection) => {
          if (connection.shapeId === handle.associatedShapeId) {
            movingConnectionIds.push(connection.id);
          }
        });
      }
      return of(
        ControlFrameEffectsActions.dragStartHandle({
          dragOffset: handle.dragOffset(mousePagePos),
          controlShapes: handle.reshaper.modifiedFrameForDrag(controlFrame),
          connectionHook: null,
          movingConnectionIds,
        })
      );
    }
    const connectionId = handle.associatedShapeId + '_' + handle.handleType;
    const attachedConnection = connections.get(connectionId);
    if (attachedConnection) {
      return of(
        ControlFrameEffectsActions.dragStartHandle({
          dragOffset: handle.dragOffset(mousePagePos),
          controlShapes: handle.reshaper.modifiedFrameForDrag(controlFrame),
          connectionHook: attachedConnection.copy({}),
          movingConnectionIds: [],
        })
      );
    }
    return of(
      ControlFrameEffectsActions.dragStartHandle({
        dragOffset: handle.dragOffset(mousePagePos),
        controlShapes: handle.reshaper.modifiedFrameForDrag(controlFrame),
        connectionHook: new CircleConnection({
          id: connectionId,
          connectorId: handle.associatedShapeId,
          end: handle.handleType,
          shapeId: '',
          connectionPoint: { x: 0, y: 0 },
          normalisedVector: { x: 0, y: 0 },
        }),
        movingConnectionIds: [],
      })
    );
  }

  return of(ControlFrameEffectsActions.frameChange({ modifiedShapes: [] }));
};
