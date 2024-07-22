import { MouseMachineActions } from '@tfx-diagram/diagram-data-access-store-actions';
import { Group } from '@tfx-diagram/diagram/data-access/shape-classes';
import { AppState } from '@tfx-diagram/electron-renderer-web-context-bridge-api';
import { undoableOperationTriggerActions } from './undoable-operation-trigger-actions';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function checkForUndoTrigger(state: AppState, action: any): boolean {
  const actionType = action.type as string;
  if (undoableOperationTriggerActions[actionType]) {
    if (actionType === MouseMachineActions.leftButtonDown.type) {
      return doMouseMachineActionsLeftButtonDown(state);
    }
    if (actionType === MouseMachineActions.ctrlLeftButtonDown.type) {
      return doMouseMachineActionsCtrlLeftButtonDown(state);
    }
    return true;
  }
  return false;
}

function doMouseMachineActionsLeftButtonDown(state: AppState): boolean {
  // Only return true if button down on page background or on a
  // selectable shape, other than a handle, that is not currently
  // selected.
  const { selectedShapeIds, highlightedShapeId } = state.controlFrame;
  const { shapes } = state.shapes;
  if (highlightedShapeId === '') {
    return true;
  }
  if (selectedShapeIds.includes(Group.topLevelGroupIdFromId(highlightedShapeId, shapes))) {
    return false;
  }
  const shape = shapes.get(highlightedShapeId);
  if (shape && shape.selectable) {
    return true;
  }
  return false;
}

function doMouseMachineActionsCtrlLeftButtonDown(state: AppState): boolean {
  // Will return true if <ctrl><left button down> on page background or
  // on a selectable shape, other than a handle
  const { highlightedShapeId } = state.controlFrame;
  const { shapes } = state.shapes;
  if (highlightedShapeId === '') {
    return true;
  }
  const shape = shapes.get(highlightedShapeId);
  if (shape && shape.selectable) {
    return true;
  }
  return false;
}
