import { Connection, Shape } from '@tfx-diagram/diagram-data-access-shape-base-class';
import { ControlFrameEffectsActions } from '@tfx-diagram/diagram-data-access-store-actions';
import { Group } from '@tfx-diagram/diagram/data-access/shape-classes';
import { inverseTransform } from '@tfx-diagram/diagram/util/misc-functions';
import { Point, Transform } from '@tfx-diagram/electron-renderer-web/shared-types';
import { of } from 'rxjs';
import { getMovingConnectionIds } from './helper-functions';

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
  shapeSnap: boolean
) => {
  const mousePagePos = inverseTransform(mousePos, transform);
  let movingConnectionIds: string[] = [];

  if (selectedShape.shapeType === 'group') {
    movingConnectionIds = getGroupMovingConnectionIds(
      selectedShape,
      shapes,
      connections,
      shapeSnap
    );
  } else {
    movingConnectionIds = getShapeMovingConnectionIds(selectedShape, connections, shapeSnap);
  }

  return of(
    ControlFrameEffectsActions.dragStartSingleSelection({
      selectedShape,
      dragOffset: selectedShape.dragOffset(mousePagePos, shapes),
      frameShapes: selectedShape.outlineShapes(shapes),
      movingConnectionIds,
    })
  );
};

const getShapeMovingConnectionIds = (
  selectedShape: Shape,
  connections: Map<string, Connection>,
  shapeSnap: boolean
): string[] => {
  const movingConnectionIds: string[] = [];
  // If snap-to-shape enabled and the selected shape is in
  // the shape category iterate across all connections to
  // find connections with the selected shape. Note if the
  // selected shape is a connector then any associated
  // connections will be removed as part of drag start.
  if (shapeSnap && selectedShape.category() === 'shape') {
    connections.forEach((connection) => {
      if (connection.shapeId === selectedShape.id) {
        movingConnectionIds.push(connection.id);
      }
    });
  }
  return movingConnectionIds;
};

const getGroupMovingConnectionIds = (
  selectedShape: Shape,
  shapes: Map<string, Shape>,
  connections: Map<string, Connection>,
  shapeSnap: boolean
): string[] => {
  // const ids = getGroupShapeIds(selectedShape.id, shapes);
  const ids = Group.drawableShapeIds(selectedShape as Group, shapes);
  return getMovingConnectionIds(ids, shapes, connections, shapeSnap);
};
