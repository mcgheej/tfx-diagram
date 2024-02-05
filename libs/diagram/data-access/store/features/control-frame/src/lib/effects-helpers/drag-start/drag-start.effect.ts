import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import {
  ControlFrameEffectsActions,
  MouseMachineActions,
} from '@tfx-diagram/diagram-data-access-store-actions';
import { selectShapeSnap } from '@tfx-diagram/diagram-data-access-store-features-settings';
import { selectTransform } from '@tfx-diagram/diagram-data-access-store-features-transform';
import { Group } from '@tfx-diagram/diagram/data-access/shape-classes';
import {
  selectConnections,
  selectShapes,
} from '@tfx-diagram/diagram/data-access/store/features/shapes';
import { Transform } from '@tfx-diagram/electron-renderer-web/shared-types';
import { filter, of, switchMap } from 'rxjs';
import {
  selectControlShapes,
  selectHighlightedShapeId,
  selectSelectedShapeIds,
  selectSelectionFrameStart,
} from '../../control-frame.feature';
import { doHandleDragStart } from './do-handle-drag-start';
import { doMultiSelectionDragStart } from './do-multi-selection-drag-start';
import { doSelectionBoxDragStart } from './do-selection-box-drag-start';
import { doSingleSelectionDragStart } from './do-single-selection-drag-start';

/**
 *
 * @param actions$
 * @param store
 * @returns
 *
 * This effect is triggered by the MouseMachineActions.dragStart action. The
 * effect determines what is being dragged, i.e. the drag type, and then
 * dispatches the appropriate action. Drag types are:
 *
 *    - selection-box:  a rubber band box with a corner fixed at the drag start
 *                      position. When the drag ends any shapes within the
 *                      selection box will be selected.
 *                      ControlFrameEffectsActions.dragStartSelectionBox action
 *                      dispatched
 *
 *    - single-selection: the selected shape will be moved around as the user
 *                        drags it. When the drag ends the shape is left at its
 *                        final position still selected.
 *                        ControlFrameEffectsActions.dragStartSingleSelection
 *                        action dispatched.
 *
 *    - multi-selection:  the selected shapes are moved around as the user
 *                        drags them. When the drag ends the shapes are left
 *                        at their final positions still selected.
 *                        ControlFrameEffectsActions.dragStartMultiSelection
 *                        action dispatched.
 *
 *    - handle: this occurs when the user starts a drag operation over
 *              a control handle displayed as part of a shape's selection
 *              control frame. The control handle is moved as the user drags
 *              it, reshaping the associated shape as it moves. When the
 *              drag ends the shape is left reshaped and selected.
 *              ControlFrameEffectsActions.dragStartHandle action dispatched.
 *
 * If the type of drag cannot be determined because not all criteria are
 * met then the effect simply dispatches a ControlFrameEffectsActions.frameChanged
 * action and the drag operation is ignored.
 */
export const dragStart = (actions$: Actions<Action>, store: Store) => {
  return createEffect(() => {
    return actions$.pipe(
      ofType(MouseMachineActions.dragStart),
      concatLatestFrom(() => [
        store.select(selectTransform),
        store.select(selectHighlightedShapeId),
        store.select(selectSelectionFrameStart),
        store.select(selectSelectedShapeIds),
        store.select(selectShapes),
        store.select(selectConnections),
        store.select(selectControlShapes),
        store.select(selectShapeSnap),
      ]),
      filter(([, transform]) => transform !== null),
      switchMap(
        ([
          { mousePos },
          transform,
          highlightedShapeId,
          selectionFrameStart,
          selectedShapeIds,
          shapes,
          connections,
          controlShapes,
          shapeSnap,
        ]) => {
          if (highlightedShapeId === '') {
            return doSelectionBoxDragStart(mousePos, transform as Transform);
          }
          if (selectedShapeIds.length === 1) {
            const highlightedItemId = Group.topLevelGroupIdFromId(highlightedShapeId, shapes);
            const selectedShape = shapes.get(highlightedItemId);
            if (selectedShape) {
              return doSingleSelectionDragStart(
                mousePos,
                transform as Transform,
                selectedShape,
                shapes,
                connections,
                shapeSnap
              );
            } else {
              const handle = controlShapes.get(highlightedShapeId);
              if (handle) {
                return doHandleDragStart(
                  mousePos,
                  transform as Transform,
                  highlightedShapeId,
                  connections,
                  selectionFrameStart,
                  controlShapes,
                  shapeSnap
                );
              }
            }
          } else if (selectedShapeIds.length > 1) {
            return doMultiSelectionDragStart(
              mousePos,
              transform as Transform,
              selectedShapeIds,
              shapes,
              connections,
              shapeSnap
            );
          }
          return of(ControlFrameEffectsActions.frameChange({ modifiedShapes: [] }));
        }
      )
    );
  });
};
