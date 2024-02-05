import {
  Connection,
  getShapesArrayFromMapList,
  Shape,
} from '@tfx-diagram/diagram-data-access-shape-base-class';
import { ControlFrameEffectsActions } from '@tfx-diagram/diagram-data-access-store-actions';
import { Handle } from '@tfx-diagram/diagram/data-access/shape-classes';
import {
  inverseTransform,
  pointAdd,
  pointSubtract,
} from '@tfx-diagram/diagram/util/misc-functions';
import {
  GridProps,
  Page,
  Point,
  Transform,
} from '@tfx-diagram/electron-renderer-web/shared-types';
import { of } from 'rxjs';
import { getModifiedConnections } from './get-connector';

export const doHandleDragMove = (
  mousePos: Point,
  transform: Transform,
  dragOffset: Point,
  highlightedShapeId: string,
  shapes: Map<string, Shape>,
  selectionFrameStart: string,
  controlShapes: Map<string, Shape>,
  gridProps: GridProps,
  connectionHook: Connection | null,
  currentPage: Page | null,
  movingConnectionIds: string[],
  connections: Map<string, Connection>
) => {
  const handle = controlShapes.get(highlightedShapeId) as Handle;
  if (handle && handle.shapeType === 'handle') {
    const prevMousePagePos = pointAdd(handle.anchor(), dragOffset);
    const shiftDelta = pointSubtract(
      inverseTransform(mousePos, transform as Transform),
      prevMousePagePos
    );
    let newHandlePos = pointAdd(shiftDelta, { x: handle.x, y: handle.y });
    const controlShapesArray = getShapesArrayFromMapList(selectionFrameStart, controlShapes);
    const associatedShape = shapes.get(handle.associatedShapeId);
    if (associatedShape) {
      if (connectionHook && currentPage) {
        connectionHook = attachEnd(
          currentPage,
          shapes,
          connectionHook,
          newHandlePos,
          transform
        );
        if (connectionHook.shapeId) {
          newHandlePos = connectionHook.connectionPoint;
        }
      }
      const modifiedShape = handle.reshaper.modifiedShape(
        newHandlePos,
        associatedShape,
        gridProps,
        handle,
        controlShapesArray,
        connectionHook
      );
      const modifiedControlShapes = handle.reshaper.modifiedControlFrame(
        modifiedShape,
        controlShapesArray,
        handle
      );
      // If shape is not a connector then reshape any connectors connected
      // to shape
      const modifiedShapes = new Map<string, Shape>();
      modifiedShapes.set(modifiedShape.id, modifiedShape);
      const modifiedConnections = getModifiedConnections(
        movingConnectionIds,
        connections,
        shapes,
        modifiedShapes
      );
      return of(
        ControlFrameEffectsActions.dragMoveHandle({
          controlShapes: modifiedControlShapes,
          shapes: [...modifiedShapes.values()],
          connectionHook,
          modifiedConnections,
        })
      );
    }
  }
  return of(ControlFrameEffectsActions.frameChange({ modifiedShapes: [] }));
};

const attachEnd = (
  currentPage: Page,
  shapes: Map<string, Shape>,
  connectionHook: Connection,
  p: Point,
  t: Transform
): Connection => {
  let s = shapes.get(currentPage.lastShapeId);
  while (s) {
    const newConnectionHook = s.attachBoundary(p, t, connectionHook);
    if (newConnectionHook) {
      return newConnectionHook;
    }
    s = shapes.get(s.prevShapeId);
  }
  return connectionHook.copy({ shapeId: '' });
};
