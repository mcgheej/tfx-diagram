import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import {
  ControlFrameEffectsActions,
  ShapesEffectsActions,
} from '@tfx-diagram/diagram-data-access-store-actions';
import { of, switchMap } from 'rxjs';

export const deleteShapesOnPage = (actions$: Actions<Action>) => {
  return createEffect(() => {
    return actions$.pipe(
      ofType(ShapesEffectsActions.deleteShapesOnPage),
      switchMap(() => {
        return of(
          ControlFrameEffectsActions.selectionChange({
            selectedShapeIds: [],
            frameShapes: [],
          })
        );
      })
    );
  });
};
