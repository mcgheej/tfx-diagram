import { ControlFrameEffectsActions } from '@tfx-diagram/diagram-data-access-store-actions';
import {
  Connection,
  Shape,
  getDrawableShapeIdsInSelection,
} from '@tfx-diagram/diagram/data-access/shape-classes';
import { inverseTransform } from '@tfx-diagram/diagram/util/misc-functions';
import { Point, Transform } from '@tfx-diagram/electron-renderer-web/shared-types';
import { of } from 'rxjs';
import { getMovingConnectionIds } from './helper-functions';

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
  // const selectedShapes = getShapesArrayFromIdArray(selectedShapeIds, shapes);
  if (selectedShapeIds.length > 0) {
    const s = shapes.get(selectedShapeIds[0]);
    if (s) {
      const shapeIds = getDrawableShapeIdsInSelection(selectedShapeIds, shapes);
      const mousePagePos = inverseTransform(mousePos, transform);
      // const movingConnectionIds: string[] = [];
      const movingConnectionIds = getMovingConnectionIds(
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
        })
      );
    }
  }
  return of(ControlFrameEffectsActions.frameChange({ modifiedShapes: [] }));
};
