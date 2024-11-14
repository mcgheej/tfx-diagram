import { Actions, createEffect, ofType } from '@ngrx/effects';import { concatLatestFrom } from '@ngrx/operators';

import { Action, Store } from '@ngrx/store';
import {
  ControlFrameEffectsActions,
  MouseMachineActions,
} from '@tfx-diagram/diagram-data-access-store-actions';
import { Shape } from '@tfx-diagram/diagram/data-access/shape-classes';
import {
  selectConnections,
  selectShapes,
} from '@tfx-diagram/diagram/data-access/store/features/shapes';
import { of, switchMap } from 'rxjs';

export const highlightChange = (actions$: Actions<Action>, store: Store) => {
  return createEffect(() => {
    return actions$.pipe(
      ofType(MouseMachineActions.highlightedShapeIdChange),
      concatLatestFrom(() => [
        store.select(selectShapes),
        store.select(selectConnections),
      ]),
      switchMap(([action, shapes, connections]) => {
        const highlightedShape = shapes.get(action.id);
        let highlightFrame: Shape[] = [];
        if (highlightedShape) {
          highlightFrame = highlightedShape.highLightFrame(shapes, connections);
        }
        return of(
          ControlFrameEffectsActions.highlightFrameChange({
            frameShapes: highlightFrame,
          })
        );
      })
    );
  });
};
