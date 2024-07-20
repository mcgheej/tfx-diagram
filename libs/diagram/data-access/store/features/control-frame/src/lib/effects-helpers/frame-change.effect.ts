import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import {
  ControlFrameEffectsActions,
  FontFamilyButtonServiceActions,
  FontSizeButtonServiceActions,
  KeyboardStateServiceActions,
  ShapesEffectsActions,
  TextOptionsServiceActions,
} from '@tfx-diagram/diagram-data-access-store-actions';
import { of, switchMap } from 'rxjs';

export const frameChanged = (actions$: Actions<Action>) => {
  return createEffect(() => {
    return actions$.pipe(
      ofType(
        ControlFrameEffectsActions.highlightFrameChange,
        ControlFrameEffectsActions.selectionChange,
        ControlFrameEffectsActions.dragMoveSelectionBox,
        ControlFrameEffectsActions.dragEndSelectionBox,
        ControlFrameEffectsActions.dragStartSingleSelection,
        ControlFrameEffectsActions.dragMoveSingleSelection,
        ControlFrameEffectsActions.dragEndSingleSelection,
        ControlFrameEffectsActions.dragMoveMultiSelection,
        ControlFrameEffectsActions.dragStartHandle,
        ControlFrameEffectsActions.dragMoveHandle,
        ControlFrameEffectsActions.dragEndHandle,
        ControlFrameEffectsActions.editTextChange,
        KeyboardStateServiceActions.navigateTextCursor,
        KeyboardStateServiceActions.editTextChange,
        ShapesEffectsActions.textInsertPositionChange,
        FontSizeButtonServiceActions.fontPropsChange,
        FontFamilyButtonServiceActions.fontPropsChange,
        TextOptionsServiceActions.fontPropsChange
      ),
      switchMap((action) => {
        if (
          action.type === ControlFrameEffectsActions.DRAG_MOVE_SINGLE_SELECTION ||
          action.type === ControlFrameEffectsActions.DRAG_MOVE_MULTI_SELECTION ||
          action.type === ControlFrameEffectsActions.DRAG_MOVE_HANDLE
        ) {
          return of(ControlFrameEffectsActions.frameChange({ modifiedShapes: action.shapes }));
        }
        return of(ControlFrameEffectsActions.frameChange({ modifiedShapes: [] }));
      })
    );
  });
};
