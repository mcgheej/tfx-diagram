import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Action, Store } from '@ngrx/store';
import {
  ArrangeMenuActions,
  ShapesEffectsActions,
} from '@tfx-diagram/diagram-data-access-store-actions';
import { filter, of, switchMap } from 'rxjs';
import { selectConnections, selectShapes } from '../shapes.feature';
import {
  alignBottom,
  alignCenter,
  alignLeft,
  alignMiddle,
  alignRight,
  alignTop,
} from './helper-functions';

const alignFncs = {
  left: alignLeft,
  center: alignCenter,
  right: alignRight,
  top: alignTop,
  middle: alignMiddle,
  bottom: alignBottom,
};

export const alignObjects = (actions$: Actions<Action>, store: Store) => {
  return createEffect(() => {
    return actions$.pipe(
      ofType(ArrangeMenuActions.alignObjectsClick),
      concatLatestFrom(() => [
        store.select(selectShapes),
        store.select(selectConnections),
      ]),
      filter(([action]) => action.selectedShapeIds.length > 1),
      switchMap(([action, shapes, connections]) => {
        const { selectedShapeIds } = action;
        const pivotShape = shapes.get(selectedShapeIds[0]);
        if (pivotShape && alignFncs[action.value]) {
          const { modifiedShapes, compromisedConnectionIds } = alignFncs[action.value](
            pivotShape.boundingBox(),
            selectedShapeIds,
            shapes,
            connections,
          );
          return of(
            ShapesEffectsActions.alignObjects({
              selectedShapeIds,
              shapes: modifiedShapes,
              compromisedConnectionIds,
            }),
          );
        }
        return of(
          ShapesEffectsActions.alignObjects({
            selectedShapeIds,
            shapes: [],
            compromisedConnectionIds: [],
          }),
        );
      }),
    );
  });
};
