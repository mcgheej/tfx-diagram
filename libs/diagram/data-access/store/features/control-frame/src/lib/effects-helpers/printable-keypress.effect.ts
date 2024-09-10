import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Rectangle, Shape } from '@tfx-diagram/diagram-data-access-shape-base-class';
import {
  ControlFrameEffectsActions,
  KeyboardStateServiceActions,
} from '@tfx-diagram/diagram-data-access-store-actions';
import { selectShapes } from '@tfx-diagram/diagram/data-access/store/features/shapes';
import { TextEdit } from '@tfx-diagram/diagram/data-access/text-classes';
import { filter, map, of, switchMap } from 'rxjs';
import { selectTextEdit } from '../control-frame.feature';

export const printableKeypress = (actions$: Actions<Action>, store: Store) => {
  return createEffect(() => {
    return actions$.pipe(
      ofType(KeyboardStateServiceActions.printableCharPressed),
      concatLatestFrom(() => [store.select(selectTextEdit), store.select(selectShapes)]),
      map(([{ key }, textEdit, shapes]) => {
        let shape: Shape | null = null;
        if (textEdit) {
          const t = shapes.get(textEdit.associatedShapeId);
          shape = t ? t : null;
        }
        return { key, textEdit, shape };
      }),
      filter(({ key, textEdit, shape }) => {
        if (key.length !== 1 || textEdit === null || shape === null) {
          return false;
        }
        if ((shape as Rectangle).textConfig) {
          return true;
        }
        return false;
      }),
      switchMap(({ key, textEdit, shape }) => {
        let { start, end } = (textEdit as TextEdit).selectionSpan;
        if (end < start) {
          const temp = end;
          end = start;
          start = temp;
        }
        const text = (shape as Rectangle).text();
        const newText = text.slice(0, start) + key + text.slice(end);
        return of(
          ControlFrameEffectsActions.selectedShapeTextConfigChange({
            shapeId: (textEdit as TextEdit).associatedShapeId,
            textConfig: {
              text: newText,
            },
            newInsertPosition: start + 1,
          })
        );
      })
    );
  });
};
