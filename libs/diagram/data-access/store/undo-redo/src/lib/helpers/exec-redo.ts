/* eslint-disable @typescript-eslint/no-explicit-any */
import { ActionReducer } from '@ngrx/store';
import { TextBox } from '@tfx-diagram/diagram/data-access/text-classes';
import { redoStack, undoStack } from '../state-history';
import { saveSettings } from './save-settings';

/**
 * This function is called to process a user REDO request. The
 * function first pops the last state from the redo stack.
 *
 * If the stack is empty then the function simply returns the state
 * and action passed in.
 *
 * If a state is popped from the stack the current state first gets pushed
 * to the undo stack (in case the user wants to undo it again). The setting
 * values recovered in the popped state are then saved to the local
 * storage to ensure that is in sync with the application state. The
 * TextBlockCache is flushed to make sure any recovered font properties
 * in the popped state are rendered properly. Finally, the popped state
 * and the action are returned ready to replace the current state.
 */
export function execRedo(reducer: ActionReducer<any>, state: any, action: any) {
  const actionType = action.type as string;
  const poppedState = redoStack.pop();
  if (poppedState) {
    undoStack.push({ state, actionType });
    saveSettings(poppedState.state);
    TextBox.flushTextBlockCache();
    return reducer(poppedState.state, action);
  }
  return reducer(state, action);
}
