import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import {
  ControlFrameEffectsActions,
  KeyboardStateServiceActions,
} from '@tfx-diagram/diagram-data-access-store-actions';
import { Rectangle, Shape } from '@tfx-diagram/diagram/data-access/shape-classes';
import { selectShapes } from '@tfx-diagram/diagram/data-access/store/features/shapes';
import { TextEdit } from '@tfx-diagram/diagram/data-access/text-classes';
import { filter, map, of, switchMap } from 'rxjs';
import { selectTextEdit } from '../control-frame.feature';

export const deleteKeypress = (actions$: Actions<Action>, store: Store) => {
  return createEffect(() => {
    return actions$.pipe(
      ofType(KeyboardStateServiceActions.deleteKeypress),
      concatLatestFrom(() => [store.select(selectTextEdit), store.select(selectShapes)]),
      map(([, textEdit, shapes]) => {
        let shape: Shape | null = null;
        if (textEdit) {
          const t = shapes.get(textEdit.associatedShapeId);
          shape = t ? t : null;
        }
        return { textEdit, shape };
      }),
      filter(({ textEdit, shape }) => {
        if (textEdit === null || shape === null) {
          return false;
        }
        if ((shape as Rectangle).textConfig) {
          return true;
        }
        return false;
      }),
      switchMap(({ textEdit, shape }) => {
        let { start, end } = (textEdit as TextEdit).selectionSpan;
        if (end < start) {
          const temp = end;
          end = start;
          start = temp;
        }
        const text = (shape as Rectangle).text();
        text.slice(end);
        const newText =
          start === end
            ? text.slice(0, start) + text.slice(end + 1)
            : text.slice(0, start) + text.slice(end);
        return of(
          ControlFrameEffectsActions.selectedShapeTextConfigChange({
            shapeId: (textEdit as TextEdit).associatedShapeId,
            textConfig: {
              text: newText,
            },
            newInsertPosition: start,
          })
        );
      })
    );
  });
};
