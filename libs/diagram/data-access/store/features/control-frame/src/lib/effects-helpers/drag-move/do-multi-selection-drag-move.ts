import {
  Connection,
  getDrawableShapesInSelection,
  getShapesArrayFromMapList,
  Shape,
} from '@tfx-diagram/diagram-data-access-shape-base-class';
import { ControlFrameEffectsActions } from '@tfx-diagram/diagram-data-access-store-actions';
import { inverseTransform } from '@tfx-diagram/diagram/util/misc-functions';
import { GridProps, Point, Transform } from '@tfx-diagram/electron-renderer-web/shared-types';
import { of } from 'rxjs';
import { snapShiftDelta } from '../../misc-functions';
import { getModifiedConnections } from './get-connector';

export const doMultiSelectionDragMove = (
  mousePos: Point,
  transform: Transform,
  dragOffset: Point,
  selectedShapeIds: string[],
  shapes: Map<string, Shape>,
  selectionFrameStart: string,
  controlShapes: Map<string, Shape>,
  gridProps: GridProps,
  movingConnectionIds: string[],
  connections: Map<string, Connection>
) => {
  if (selectedShapeIds.length > 0) {
    const s = shapes.get(selectedShapeIds[0]);
    if (s) {
      const mousePagePos = inverseTransform(mousePos, transform as Transform);
      const shiftDelta = snapShiftDelta(mousePagePos, dragOffset, s, shapes, gridProps);

      const movedControlShapes: Shape[] = [];
      const controlShapesArray = getShapesArrayFromMapList(selectionFrameStart, controlShapes);
      for (const controlShape of controlShapesArray) {
        movedControlShapes.push(controlShape.move(shiftDelta));
      }

      const modifiedShapes = new Map<string, Shape>();
      const selectedShapes = getDrawableShapesInSelection(selectedShapeIds, shapes);
      for (const shape of selectedShapes) {
        modifiedShapes.set(shape.id, shape.move(shiftDelta));
      }

      const modifiedConnections = getModifiedConnections(
        movingConnectionIds,
        connections,
        shapes,
        modifiedShapes
      );

      return of(
        ControlFrameEffectsActions.dragMoveMultiSelection({
          controlShapes: movedControlShapes,
          shapes: [...modifiedShapes.values()],
          modifiedConnections,
        })
      );
    }
  }
  return of(ControlFrameEffectsActions.frameChange({ modifiedShapes: [] }));
};
