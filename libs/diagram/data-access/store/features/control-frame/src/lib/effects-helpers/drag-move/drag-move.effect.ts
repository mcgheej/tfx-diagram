import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import {
  ControlFrameEffectsActions,
  MouseMachineActions,
} from '@tfx-diagram/diagram-data-access-store-actions';
import { selectCurrentPage } from '@tfx-diagram/diagram-data-access-store-features-pages';
import { selectGridProps } from '@tfx-diagram/diagram-data-access-store-features-settings';
import { selectTransform } from '@tfx-diagram/diagram-data-access-store-features-transform';
import {
  selectConnections,
  selectMovingConnectionIds,
  selectShapes,
} from '@tfx-diagram/diagram/data-access/store/features/shapes';
import { Transform } from '@tfx-diagram/electron-renderer-web/shared-types';
import { filter, of, switchMap } from 'rxjs';
import {
  selectConnectionHook,
  selectControlShapes,
  selectDragOffset,
  selectDragType,
  selectHighlightedShapeId,
  selectSelectedShapeIds,
  selectSelectionBoxAnchor,
  selectSelectionFrameStart,
} from '../../control-frame.feature';
import { doHandleDragMove } from './do-handle-drag-move';
import { doMultiSelectionDragMove } from './do-multi-selection-drag-move';
import { doSelectionBoxDragMove } from './do-selection-box-drag-move';
import { doSingleSelectionDragMove } from './do-single-selection-drag-move';

export const dragMove = (actions$: Actions<Action>, store: Store) => {
  return createEffect(() => {
    return actions$.pipe(
      ofType(MouseMachineActions.dragMove),
      concatLatestFrom(() => [
        store.select(selectDragType),
        store.select(selectTransform),
        store.select(selectHighlightedShapeId),
        store.select(selectDragOffset),
        store.select(selectSelectionBoxAnchor),
        store.select(selectSelectionFrameStart),
        store.select(selectSelectedShapeIds),
        store.select(selectShapes),
        store.select(selectConnections),
        store.select(selectControlShapes),
        store.select(selectGridProps),
        store.select(selectConnectionHook),
        store.select(selectCurrentPage),
        store.select(selectMovingConnectionIds),
      ]),
      filter(([, dragType, transform]) => transform !== null && dragType !== 'none'),
      switchMap(
        ([
          { mousePos },
          dragType,
          transform,
          highlightedShapeId,
          dragOffset,
          selectionBoxAnchor,
          selectionFrameStart,
          selectedShapeIds,
          shapes,
          connections,
          controlShapes,
          gridProps,
          connectionHook,
          currentPage,
          movingConnectionIds,
        ]) => {
          if (dragType === 'selection-box' && selectionFrameStart) {
            return doSelectionBoxDragMove(
              mousePos,
              transform as Transform,
              selectionBoxAnchor,
              selectionFrameStart,
              controlShapes
            );
          }
          if (dragType === 'single-selection' && selectedShapeIds.length === 1) {
            return doSingleSelectionDragMove(
              mousePos,
              transform as Transform,
              dragOffset,
              selectedShapeIds,
              shapes,
              selectionFrameStart,
              controlShapes,
              gridProps,
              movingConnectionIds,
              connections
            );
          }
          if (dragType === 'multi-selection' && selectedShapeIds.length > 1) {
            return doMultiSelectionDragMove(
              mousePos,
              transform as Transform,
              dragOffset,
              selectedShapeIds,
              shapes,
              selectionFrameStart,
              controlShapes,
              gridProps,
              movingConnectionIds,
              connections
            );
          }
          if (dragType === 'handle') {
            return doHandleDragMove(
              mousePos,
              transform as Transform,
              dragOffset,
              highlightedShapeId,
              shapes,
              selectionFrameStart,
              controlShapes,
              gridProps,
              connectionHook,
              currentPage,
              movingConnectionIds,
              connections
            );
          }
          return of(ControlFrameEffectsActions.frameChange({ modifiedShapes: [] }));
        }
      )
    );
  });
};
