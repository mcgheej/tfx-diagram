import { ControlFrameEffectsActions } from '@tfx-diagram/diagram-data-access-store-actions';
import {
  Connection,
  Group,
  Shape,
  getShapesArrayFromMapList,
} from '@tfx-diagram/diagram/data-access/shape-classes';
import { inverseTransform } from '@tfx-diagram/diagram/util/misc-functions';
import { GridProps, Point, Transform } from '@tfx-diagram/electron-renderer-web/shared-types';
import { of } from 'rxjs';
import { snapShiftDelta } from '../../misc-functions';
import { getModifiedConnections } from './get-connector';

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
    const movedControlShapes: Shape[] = [];
    const controlShapesArray = getShapesArrayFromMapList(selectionFrameStart, controlShapes);
    for (const controlShape of controlShapesArray) {
      movedControlShapes.push(controlShape.move(shiftDelta));
    }
    const modifiedShapes = new Map<string, Shape>();
    if (selectedShape.shapeType === 'group') {
      for (const shape of Group.drawableShapes(selectedShape as Group, shapes)) {
        modifiedShapes.set(shape.id, shape.move(shiftDelta));
      }
    } else {
      modifiedShapes.set(selectedShape.id, selectedShape.move(shiftDelta));
    }
    const modifiedConnections = getModifiedConnections(
      movingConnectionIds,
      connections,
      shapes,
      modifiedShapes
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
