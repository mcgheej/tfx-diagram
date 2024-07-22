/* eslint-disable @typescript-eslint/no-explicit-any */
import { ActionReducer } from '@ngrx/store';
import {
  ControlFrameEffectsActions,
  EditMenuActions,
  PageViewportComponentActions,
  SaveCloseMachineActions,
  SketchbookEffectsActions,
} from '@tfx-diagram/diagram-data-access-store-actions';
import { TextBox } from '@tfx-diagram/diagram/data-access/text-classes';
import { checkForUndoTrigger } from './check-for-undo-trigger';
import { doDragEndSelectionBox } from './do-drag-end-selection-box';
import { saveSettings } from './save-settings';
import { redoStack, undoStack } from './state-history';

export const undoDisabled$ = undoStack.disabled$;
export const redoDisabled$ = redoStack.disabled$;

export const undoRedoMetaReducer = (reducer: ActionReducer<any>) => {
  return (state: any, action: any) => {
    const actionType = action.type as string;
    if (checkForUndoTrigger(state, action)) {
      // Action is a trigger action for a user operation that can be undone
      // by the UNDO command
      undoStack.push({ state, actionType });
      redoStack.clear();
    } else if (actionType === EditMenuActions.undoClick.type) {
      // Action indicates user has requested an UNDO
      const poppedState = undoStack.pop();
      if (poppedState) {
        redoStack.push({ state, actionType });
        saveSettings(poppedState.state);
        TextBox.flushTextBlockCache(); // Do this to ensure font changes are applied
        return reducer(poppedState.state, action);
      }
    } else if (actionType === EditMenuActions.redoClick.type) {
      // Action indicates user has requested a REDO
      const poppedState = redoStack.pop();
      if (poppedState) {
        undoStack.push({ state, actionType });
        saveSettings(poppedState.state);
        TextBox.flushTextBlockCache();
        return reducer(poppedState.state, action);
      }
    } else if (actionType === ControlFrameEffectsActions.dragEndSelectionBox.type) {
      // Action indicates end of selection box drag so perform special processing
      // for an empty selection
      doDragEndSelectionBox(action);
    } else if (
      actionType === PageViewportComponentActions.viewportSizeChange.type ||
      actionType === SketchbookEffectsActions.saveSuccess.type ||
      actionType === SaveCloseMachineActions.closeStart.type
    ) {
      // Any of these actions require the undo/redo stacks are cleared
      undoStack.clear();
      redoStack.clear();
    }
    return reducer(state, action);
  };
};
