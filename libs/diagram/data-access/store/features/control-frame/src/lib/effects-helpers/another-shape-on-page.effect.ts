import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import {
  ControlFrameEffectsActions,
  ShapesEffectsActions,
} from '@tfx-diagram/diagram-data-access-store-actions';
import { of, switchMap } from 'rxjs';

export const anotherShapeOnPage = (actions$: Actions<Action>) => {
  return createEffect(() => {
    return actions$.pipe(
      ofType(ShapesEffectsActions.anotherShapeOnPage),
      switchMap((action) => {
        return of(
          ControlFrameEffectsActions.selectionChange({
            selectedShapeIds: [action.shapes[0].id],
            frameShapes: action.shapes[0].selectFrame(),
          })
        );
      })
    );
  });
};
