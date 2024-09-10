import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import {
  ControlFrameEffectsActions,
  MouseMachineActions,
} from '@tfx-diagram/diagram-data-access-store-actions';
import { selectCurrentPage } from '@tfx-diagram/diagram-data-access-store-features-pages';
import {
  Group,
  RectangleOutline,
  Shape,
  getShapesArrayFromMapList,
} from '@tfx-diagram/diagram/data-access/shape-classes';
import { selectShapes } from '@tfx-diagram/diagram/data-access/store/features/shapes';
import { rectIntersect } from '@tfx-diagram/diagram/util/misc-functions';
import { filter, of, switchMap } from 'rxjs';
import {
  selectConnectionHook,
  selectControlShapes,
  selectDragType,
  selectHighlightedShapeId,
  selectSelectionFrameStart,
} from '../control-frame.feature';
import { getMultiSelectControlFrame } from '../misc-functions';

export const dragEnd = (actions$: Actions<Action>, store: Store) => {
  return createEffect(() => {
    return actions$.pipe(
      ofType(MouseMachineActions.dragEnd),
      concatLatestFrom(() => [
        store.select(selectDragType),
        store.select(selectHighlightedShapeId),
        store.select(selectSelectionFrameStart),
        store.select(selectCurrentPage),
        store.select(selectShapes),
        store.select(selectControlShapes),
        store.select(selectConnectionHook),
      ]),
      filter(([, dragType]) => dragType !== 'none'),
      switchMap(
        ([
          ,
          dragType,
          highlightedShapeId,
          selectionFrameStart,
          currentPage,
          shapes,
          controlShapes,
          connectionHook,
        ]) => {
          if (dragType === 'selection-box') {
            const selectionBox = controlShapes.get(selectionFrameStart) as RectangleOutline;
            const selectionRect = selectionBox.boundingBox();
            const selectedShapeIds: string[] = [];
            if (currentPage) {
              let shape = shapes.get(currentPage.firstShapeId);
              while (shape) {
                if (rectIntersect(shape.boundingBox(), selectionRect)) {
                  const itemId = Group.topLevelGroupIdFromId(shape.id, shapes);
                  if (!selectedShapeIds.includes(itemId)) {
                    selectedShapeIds.push(itemId);
                  }
                }
                shape = shapes.get(shape.nextShapeId);
              }
            }
            let controlFrame: Shape[] = [];
            if (selectedShapeIds.length === 1) {
              const selectedShape = shapes.get(selectedShapeIds[0]);
              if (selectedShape) {
                controlFrame = selectedShape.selectFrame(shapes);
              }
            } else if (selectedShapeIds.length > 1) {
              controlFrame = getMultiSelectControlFrame(selectedShapeIds, shapes);
            }
            return of(
              ControlFrameEffectsActions.dragEndSelectionBox({ selectedShapeIds, controlFrame })
            );
          }
          if (dragType === 'single-selection') {
            const highlightedItemId = Group.topLevelGroupIdFromId(highlightedShapeId, shapes);
            const selectedShape = shapes.get(highlightedItemId);
            if (selectedShape) {
              return of(
                ControlFrameEffectsActions.dragEndSingleSelection({
                  selectedShapeIds: [highlightedItemId],
                  frameShapes: selectedShape.selectFrame(shapes),
                })
              );
            } else {
              return of(
                ControlFrameEffectsActions.dragEndSingleSelection({
                  selectedShapeIds: [],
                  frameShapes: [],
                })
              );
            }
          }
          if (dragType === 'multi-selection') {
            return of(ControlFrameEffectsActions.dragEndMultiSelection());
          }
          if (dragType === 'handle') {
            const controlFrame = getShapesArrayFromMapList(selectionFrameStart, controlShapes);
            const modifiedShapes: Shape[] = [];
            for (const shape of controlFrame) {
              if (!shape.visible) {
                modifiedShapes.push(shape.copy({ visible: true }));
              }
            }
            const connectionHookCopy = connectionHook ? connectionHook.copy({}) : null;
            return of(
              ControlFrameEffectsActions.dragEndHandle({
                controlShapes: modifiedShapes,
                connectionHook: connectionHookCopy,
              })
            );
          }
          return of(ControlFrameEffectsActions.frameChange({ modifiedShapes: [] }));
        }
      )
    );
  });
};
