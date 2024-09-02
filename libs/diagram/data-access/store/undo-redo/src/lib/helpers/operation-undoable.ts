/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  MouseMachineActions,
  PageViewportComponentActions,
} from '@tfx-diagram/diagram-data-access-store-actions';
import { Group } from '@tfx-diagram/diagram/data-access/shape-classes';
import { AppState } from '@tfx-diagram/electron-renderer-web-context-bridge-api';
import { redoStack, undoStack } from '../state-history';
import { undoableOperationTriggerActions } from '../undoable-operation-trigger-actions';

/**
 *
 * @param state
 * @param action
 * @returns true if action indicates start of operation that can be undone
 *          false if action does not indicate start of operation that can be
 *          undone
 *
 * This function determines whether or not an action indicates the start
 * of an user requested operation that could be undone by the UNDO
 * feature. It does this by first checking if the action is defined
 * in the trigger actions object. If it is it then checks if the action
 * is an irregular trigger action and performs the necessary check for
 * that action to see whether or not the operation is dependent on the
 * current state of the application.
 */
export function operationCanBeUndone(state: AppState, action: any): boolean {
  const actionType = action.type as string;
  if (undoableOperationTriggerActions[actionType]) {
    if (actionType === MouseMachineActions.leftButtonDown.type) {
      return doMouseMachineActionsLeftButtonDown(state);
    }
    if (
      actionType === MouseMachineActions.ctrlLeftButtonDown.type ||
      actionType === PageViewportComponentActions.rightButtonDown.type
    ) {
      return doMouseMachineActionsCtrlLeftButtonDown(state);
    }
    return true;
  }
  return false;
}

export function pushUndo(state: AppState, actionType: string) {
  undoStack.push({ state, actionType });
  redoStack.clear();
}

/**
 * This is executed when the user presses down the left mouse button in the viewport.
 * The function only return true, to indicate the start of a user requested
 * operation that could be undone, if the button down occurs when the mouse
 * is over the page background or over a selectable shape, other than a handle,
 * that is not currently selected.
 */
function doMouseMachineActionsLeftButtonDown(state: AppState): boolean {
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

/**
 * This function is called when the user presses the <ctrl> left button down
 * in the viewport. The function will only return true, to indicate the start
 * of a user requested operation that could be undone, if the mouse is over
 * the page background or on a selectable shape, other than a handle.
 */
function doMouseMachineActionsCtrlLeftButtonDown(state: AppState): boolean {
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
