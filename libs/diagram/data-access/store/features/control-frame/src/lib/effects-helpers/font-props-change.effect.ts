import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Action, Store } from '@ngrx/store';
import {
  ColorButtonsServiceActions,
  ControlFrameEffectsActions,
  FontControlsComponentActions,
  FontFamilyButtonServiceActions,
  FontSizeButtonServiceActions,
  TextOptionsServiceActions,
} from '@tfx-diagram/diagram-data-access-store-actions';
import { of, switchMap } from 'rxjs';
import { selectSelectedShapeIds } from '../control-frame.feature';

export const fontPropsChange = (actions$: Actions<Action>, store: Store) => {
  return createEffect(() => {
    return actions$.pipe(
      ofType(
        FontControlsComponentActions.fontPropsChange,
        ColorButtonsServiceActions.fontPropsChange,
        FontSizeButtonServiceActions.fontPropsChange,
        FontFamilyButtonServiceActions.fontPropsChange,
        TextOptionsServiceActions.fontPropsChange
      ),
      concatLatestFrom(() => [store.select(selectSelectedShapeIds)]),
      switchMap(([action, selectedShapeIds]) => {
        if (selectedShapeIds.length > 0) {
          return of(
            ControlFrameEffectsActions.selectedShapesFontPropsChange({
              props: action.props,
              selectedShapeIds,
            })
          );
        } else {
          return of(ControlFrameEffectsActions.fontPropsChange({ props: action.props }));
        }
      })
    );
  });
};
