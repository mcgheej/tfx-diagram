/* eslint-disable @typescript-eslint/no-explicit-any */
import { ActionReducer } from '@ngrx/store';
import {
  ControlFrameEffectsActions,
  EditMenuActions,
} from '@tfx-diagram/diagram-data-access-store-actions';
import { doDragEndSelectionBox } from './helpers/do-drag-end-selection-box';
import { execRedo } from './helpers/exec-redo';
import { execUndo } from './helpers/exec-undo';
import { operationInvalidatesUndo, resetUndo } from './helpers/operation-invalidates';
import { operationCanBeUndone, pushUndo } from './helpers/operation-undoable';
import { redoStack, undoStack } from './state-history';

// Observables that can be used to enable/disable UI elements that
// expose the undo/redo functionality (e.g. menu items)
export const undoDisabled$ = undoStack.disabled$;
export const redoDisabled$ = redoStack.disabled$;

export const undoRedoMetaReducer = (reducer: ActionReducer<any>) => {
  return (state: any, action: any) => {
    const actionType = action.type as string;
    if (operationCanBeUndone(state, action)) {
      pushUndo(state, actionType);
    } else if (operationInvalidatesUndo(actionType)) {
      resetUndo();
    } else if (actionType === ControlFrameEffectsActions.dragEndSelectionBox.type) {
      doDragEndSelectionBox(action);
    } else if (actionType === EditMenuActions.undoClick.type) {
      return execUndo(reducer, state, action);
    } else if (actionType === EditMenuActions.redoClick.type) {
      return execRedo(reducer, state, action);
    }
    return reducer(state, action);
  };
};
