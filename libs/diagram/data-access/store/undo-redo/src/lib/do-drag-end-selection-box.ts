/* eslint-disable @typescript-eslint/no-explicit-any */
import { ControlFrameEffectsActions } from '@tfx-diagram/diagram-data-access-store-actions';
import { undoStack } from './state-history';

export function doDragEndSelectionBox(action: any): void {
  const newSelectedShapeIds = action.selectedShapeIds as string[];

  // If no shapes selected then need to remove the last element from the
  // UNDO stack if it was a drag start selection box action trigger
  const lastPushedState = undoStack.peek();
  if (
    lastPushedState &&
    newSelectedShapeIds.length === 0 &&
    lastPushedState.actionType === ControlFrameEffectsActions.dragStartSelectionBox.type
  ) {
    undoStack.pop();
  }
}
