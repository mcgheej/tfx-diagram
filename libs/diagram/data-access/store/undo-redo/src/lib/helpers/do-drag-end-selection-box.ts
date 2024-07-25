/* eslint-disable @typescript-eslint/no-explicit-any */
import { ControlFrameEffectsActions } from '@tfx-diagram/diagram-data-access-store-actions';
import { undoStack } from '../state-history';

/**
 * If a selection box drag completes and no shapes are selected
 * then remove the last element from the UNDO stack if it was a
 * drag start selection box action trigger. This is done to avoid
 * stacking an unnecessary unselect operation to be undone.
 */
export function doDragEndSelectionBox(action: any): void {
  const newSelectedShapeIds = action.selectedShapeIds as string[];
  const lastPushedState = undoStack.peek();
  if (
    lastPushedState &&
    newSelectedShapeIds.length === 0 &&
    lastPushedState.actionType === ControlFrameEffectsActions.dragStartSelectionBox.type
  ) {
    undoStack.pop();
  }
}
