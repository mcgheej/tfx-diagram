import {
  PageViewportComponentActions,
  SaveCloseMachineActions,
  SketchbookEffectsActions,
} from '@tfx-diagram/diagram-data-access-store-actions';
import { redoStack, undoStack } from '../state-history';

/**
 * Some user operations invalidate any saved states in the undo/redo
 * stacks, for example any change to the viewport size or saving
 * the application to file. This function checks the actionType
 * and return true if this action indicates the start of an operation
 * that invalidates the stacks.
 */
export function operationInvalidatesUndo(actionType: string): boolean {
  return (
    actionType === PageViewportComponentActions.viewportSizeChange.type ||
    actionType === SketchbookEffectsActions.saveSuccess.type ||
    actionType === SaveCloseMachineActions.closeStart.type
  );
}

/**
 * This function is called to clear both the undo and redo stacks. It
 * gets called when the user does something that invalidates the
 * states held in the stacks.
 */
export function resetUndo() {
  undoStack.clear();
  redoStack.clear();
}
