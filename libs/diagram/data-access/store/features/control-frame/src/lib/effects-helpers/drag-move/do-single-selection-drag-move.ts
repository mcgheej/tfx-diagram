import { ControlFrameEffectsActions } from '@tfx-diagram/diagram-data-access-store-actions';
import {
  Connection,
  Shape,
  getDrawableShapesInSelectionMap,
  getShapeArrayFromMapList,
} from '@tfx-diagram/diagram/data-access/shape-classes';
import { inverseTransform } from '@tfx-diagram/diagram/util/misc-functions';
import {
  GridProps,
  Point,
  Transform,
} from '@tfx-diagram/electron-renderer-web/shared-types';
import { of } from 'rxjs';
import { snapShiftDelta } from '../../misc-functions';
import { getModifiedConnections } from './get-modified-connections';

export const doSingleSelectionDragMove = (
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
  const selectedShape = shapes.get(selectedShapeIds[0]);
  if (selectedShape) {
    const mousePagePos = inverseTransform(mousePos, transform as Transform);
    const shiftDelta = snapShiftDelta(
      mousePagePos,
      dragOffset,
      selectedShape,
      shapes,
      gridProps
    );

    const movedControlShapes = getMovedControlShapes(
      selectionFrameStart,
      controlShapes,
      shiftDelta
    );

    const shapesInSelection = getDrawableShapesInSelectionMap([selectedShape.id], shapes);
    const modifiedShapes = getModifiedShapes(shapesInSelection, shapes, shiftDelta);

    const modifiedConnections = getModifiedConnections(
      movingConnectionIds,
      connections,
      shapes,
      modifiedShapes,
      shapesInSelection
    );

    return of(
      ControlFrameEffectsActions.dragMoveSingleSelection({
        controlShapes: movedControlShapes,
        shapes: [...modifiedShapes.values()],
        modifiedConnections,
      })
    );
  }
  return of(ControlFrameEffectsActions.frameChange({ modifiedShapes: [] }));
};

function getMovedControlShapes(
  selectionFrameStart: string,
  controlShapes: Map<string, Shape>,
  shiftDelta: Point
): Shape[] {
  const r: Shape[] = [];
  getShapeArrayFromMapList(selectionFrameStart, controlShapes).map((controlShape) => {
    r.push(controlShape.move(shiftDelta));
  });
  return r;
}

function getModifiedShapes(
  shapesInSelection: Map<string, Shape>,
  shapes: Map<string, Shape>,
  shiftDelta: Point
): Map<string, Shape> {
  const modifiedShapes = new Map<string, Shape>();
  shapesInSelection.forEach((s) => {
    modifiedShapes.set(s.id, s.move(shiftDelta));
  });
  return modifiedShapes;
}
