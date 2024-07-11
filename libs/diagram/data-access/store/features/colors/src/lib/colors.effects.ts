import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import {
  ColorDialogComponentActions,
  ShellComponentActions,
  SketchbookEffectsActions,
} from '@tfx-diagram/diagram-data-access-store-actions';
import { ColorMapRef } from '@tfx-diagram/diagram/data-access/color-classes';
import { map } from 'rxjs';
import { selectColorsState } from './colors.feature';

@Injectable()
export class ColorsEffects {
  init$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(
          ShellComponentActions.appStart,
          ColorDialogComponentActions.customColorAdd,
          SketchbookEffectsActions.openSuccess
        ),
        concatLatestFrom(() => [this.store.select(selectColorsState)]),
        map(([, colorsState]) => {
          ColorMapRef.colorsState = colorsState;
          return;
        })
      );
    },
    { dispatch: false }
  );

  constructor(private actions$: Actions, private store: Store) {}
}
