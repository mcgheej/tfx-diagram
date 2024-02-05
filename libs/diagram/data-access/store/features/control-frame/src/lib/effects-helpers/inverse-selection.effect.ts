import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { nextInChain, Shape } from '@tfx-diagram/diagram-data-access-shape-base-class';
import {
  ControlFrameEffectsActions,
  SelectionMenuActions,
} from '@tfx-diagram/diagram-data-access-store-actions';
import { selectCurrentPage } from '@tfx-diagram/diagram-data-access-store-features-pages';
import { Group } from '@tfx-diagram/diagram/data-access/shape-classes';
import { selectShapes } from '@tfx-diagram/diagram/data-access/store/features/shapes';
import { of, switchMap } from 'rxjs';
import { selectSelectedShapeIds } from '../control-frame.feature';
import { getMultiSelectControlFrame } from '../misc-functions';

export const inverseSelection = (actions$: Actions<Action>, store: Store) => {
  return createEffect(() => {
    return actions$.pipe(
      ofType(SelectionMenuActions.inverseSelectionClick),
      concatLatestFrom(() => [
        store.select(selectSelectedShapeIds),
        store.select(selectCurrentPage),
        store.select(selectShapes),
      ]),
      switchMap(([, selectedShapeIds, currentPage, shapes]) => {
        const invertedShapeIds: string[] = [];
        let frameShapes: Shape[] = [];
        if (currentPage) {
          let shape = nextInChain(currentPage.firstShapeId, shapes);
          while (shape) {
            const itemId = Group.topLevelGroupIdFromId(shape.id, shapes);
            if (!selectedShapeIds.includes(itemId)) {
              invertedShapeIds.push(itemId);
            }
            shape = nextInChain(shape.nextShapeId, shapes);
          }
        }
        if (invertedShapeIds.length === 1) {
          const selectedShape = shapes.get(invertedShapeIds[0]);
          if (selectedShape) {
            frameShapes = selectedShape.selectFrame(shapes);
          }
        } else if (invertedShapeIds.length > 1) {
          frameShapes = getMultiSelectControlFrame(invertedShapeIds, shapes);
        }
        return of(
          ControlFrameEffectsActions.selectionChange({
            selectedShapeIds: invertedShapeIds,
            frameShapes,
          })
        );
      })
    );
  });
};
