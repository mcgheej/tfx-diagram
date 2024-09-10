import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Group, Shape } from '@tfx-diagram/diagram-data-access-shape-base-class';
import {
  ControlFrameEffectsActions,
  SelectionMenuActions,
} from '@tfx-diagram/diagram-data-access-store-actions';
import { selectCurrentPage } from '@tfx-diagram/diagram-data-access-store-features-pages';
import { selectShapes } from '@tfx-diagram/diagram/data-access/store/features/shapes';
import { of, switchMap } from 'rxjs';
import { getMultiSelectControlFrame } from '../misc-functions';

export const selectAll = (actions$: Actions<Action>, store: Store) => {
  return createEffect(() => {
    return actions$.pipe(
      ofType(SelectionMenuActions.selectAllClick),
      concatLatestFrom(() => [store.select(selectCurrentPage), store.select(selectShapes)]),
      switchMap(([, currentPage, shapes]) => {
        const selectedShapeIds: string[] = [];
        let frameShapes: Shape[] = [];
        if (currentPage) {
          let shape = shapes.get(currentPage.firstShapeId);
          while (shape) {
            const itemId = Group.topLevelGroupIdFromId(shape.id, shapes);
            if (!selectedShapeIds.includes(itemId)) {
              selectedShapeIds.push(itemId);
            }
            shape = shapes.get(shape.nextShapeId);
          }
        }
        if (selectedShapeIds.length === 1) {
          const selectedShape = shapes.get(selectedShapeIds[0]);
          if (selectedShape) {
            frameShapes = selectedShape.selectFrame(shapes);
          }
        } else if (selectedShapeIds.length > 1) {
          frameShapes = getMultiSelectControlFrame(selectedShapeIds, shapes);
        }
        return of(
          ControlFrameEffectsActions.selectionChange({
            selectedShapeIds,
            frameShapes,
          })
        );
      })
    );
  });
};
