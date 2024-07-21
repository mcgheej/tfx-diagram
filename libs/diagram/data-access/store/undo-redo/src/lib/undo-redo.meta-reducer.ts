/* eslint-disable @typescript-eslint/no-explicit-any */
import { ActionReducer } from '@ngrx/store';
import {
  ControlFrameEffectsActions,
  DiagramCanvasDirectiveActions,
  EditMenuActions,
  MouseMachineActions,
  PageViewportComponentActions,
  SaveCloseMachineActions,
  SketchbookEffectsActions,
} from '@tfx-diagram/diagram-data-access-store-actions';
import { Group } from '@tfx-diagram/diagram/data-access/shape-classes';
import { TextBox } from '@tfx-diagram/diagram/data-access/text-classes';
import { LocalStorage } from '@tfx-diagram/diagram/util/misc-functions';
import { AppState } from '@tfx-diagram/electron-renderer-web-context-bridge-api';
import {
  LS_GRID_SHOW,
  LS_GRID_SNAP,
  LS_JPEG_QUALITY,
  LS_MOUSE_POSITION_COORDS_TYPE,
  LS_PAGE_ALIGNMENT_IN_VIEWPORT,
  LS_SCREEN_PIXEL_DENSITY,
  LS_SHAPE_SNAP,
  LS_SHOW_MOUSE_POSITION,
  LS_SHOW_RULERS,
  LS_SHOW_SHAPE_INSPECTOR,
} from '@tfx-diagram/electron-renderer-web/shared-types';
import { BehaviorSubject } from 'rxjs';
import { undoableOperationTriggerActions } from './undoable-operation-trigger-actions';

interface StateHistory {
  actionType: string;
  state: AppState;
}

/**
 *
 */
const maxStackSize = 20;
let undoStack: StateHistory[] = [];
let redoStack: StateHistory[] = [];

const undoDisabledSubject = new BehaviorSubject<boolean>(undoStack.length === 0);
export const undoDisabled$ = undoDisabledSubject.asObservable();

const redoDisabledSubject = new BehaviorSubject<boolean>(redoStack.length === 0);
export const redoDisabled$ = redoDisabledSubject.asObservable();

export const undoRedoMetaReducer = (reducer: ActionReducer<any>) => {
  return (state: any, action: any) => {
    const actionType = action.type as string;
    if (undoableOperationTrigger(state, action)) {
      pushUndo(state, actionType);
      clearRedoStack();
    } else if (actionType === EditMenuActions.undoClick.type) {
      const poppedState = popUndo();
      if (poppedState) {
        pushRedo(state, actionType);
        saveSettingsToLocalStorage(poppedState.state);
        TextBox.flushTextBlockCache(); // Do this to ensure font changes are applied
        return reducer(poppedState.state, action);
      }
    } else if (actionType === EditMenuActions.redoClick.type) {
      const poppedState = popRedo();
      if (poppedState) {
        pushUndo(state, actionType);
        saveSettingsToLocalStorage(poppedState.state);
        TextBox.flushTextBlockCache();
        return reducer(poppedState.state, action);
      }
    } else if (
      actionType === PageViewportComponentActions.viewportSizeChange.type ||
      actionType === SketchbookEffectsActions.saveSuccess.type ||
      actionType === SaveCloseMachineActions.closeStart.type
    ) {
      clearUndoStack();
      clearRedoStack();
    }
    if (action.type !== DiagramCanvasDirectiveActions.mouseMoveOnViewport.type) {
      // if (
      //   actionType === ControlFrameEffectsActions.dragStartSelectionBox.type ||
      //   actionType === ControlFrameEffectsActions.dragEndSelectionBox.type
      // ) {
      //   console.log(actionType);
      // }
      // console.log(actionType);
      // console.log(state);
      console.log(undoStack);
    }
    return reducer(state, action);
  };
};

function clearUndoStack() {
  undoStack = [];
  undoDisabledSubject.next(true);
}

function pushUndo(state: AppState, actionType: string) {
  if (undoStack.length === maxStackSize) {
    undoStack.shift();
  }
  undoStack.push({ actionType, state });
  undoDisabledSubject.next(false);
}

function popUndo(): StateHistory | undefined {
  const poppedState = undoStack.pop();
  undoDisabledSubject.next(undoStack.length === 0);
  return poppedState;
}

function clearRedoStack() {
  redoStack = [];
  redoDisabledSubject.next(true);
}

function pushRedo(state: AppState, actionType: string) {
  redoStack.push({ actionType, state });
  redoDisabledSubject.next(false);
}

function popRedo(): StateHistory | undefined {
  const poppedState = redoStack.pop();
  redoDisabledSubject.next(redoStack.length === 0);
  return poppedState;
}

/**
 * Function to save settings values to local storage - used
 * after undo and redo operations as state values updated
 * without firing actions that update local storage via effects
 */
function saveSettingsToLocalStorage(state: AppState) {
  const s = state.settings;
  LocalStorage.setItem(LS_GRID_SHOW, s.gridShow);
  LocalStorage.setItem(LS_GRID_SNAP, s.gridSnap);
  LocalStorage.setItem(LS_SHAPE_SNAP, s.shapeSnap);
  LocalStorage.setItem(LS_SHOW_RULERS, s.showRulers);
  LocalStorage.setItem(LS_SCREEN_PIXEL_DENSITY, s.screenPixelDensity);
  LocalStorage.setItem(LS_PAGE_ALIGNMENT_IN_VIEWPORT, s.pageAlignmentInViewport);
  LocalStorage.setItem(LS_SHOW_MOUSE_POSITION, s.showMousePosition);
  LocalStorage.setItem(LS_MOUSE_POSITION_COORDS_TYPE, s.mousePositionCoordsType);
  LocalStorage.setItem(LS_SHOW_SHAPE_INSPECTOR, s.showShapeInspector);
  LocalStorage.setItem(LS_JPEG_QUALITY, s.jpegQuality);
}

// function logStacks() {
//   console.log(undoStack);
//   console.log(redoStack);
// }

function undoableOperationTrigger(state: AppState, action: any): boolean {
  const actionType = action.type as string;
  if (undoableOperationTriggerActions[actionType]) {
    if (actionType === MouseMachineActions.leftButtonDown.type) {
      return doMouseMachineActionsLeftButtonDown(state);
    }
    if (actionType === MouseMachineActions.ctrlLeftButtonDown.type) {
      return doMouseMachineActionsCtrlLeftButtonDown(state);
    }
    if (actionType === ControlFrameEffectsActions.dragEndSelectionBox.type) {
      return doControlFrameActionsDragEndSelectionBox(action);
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

function doControlFrameActionsDragEndSelectionBox(action: any): boolean {
  const newSelectedShapeIds = action.selectedShapeIds as string[];

  // If no shapes selected then need to remove the last element from the
  // UNDO stack if it was a drag start selection box action trigger
  const lastElement = undoStack.length - 1;
  if (
    newSelectedShapeIds.length === 0 &&
    undoStack.length > 0 &&
    undoStack[lastElement].actionType === ControlFrameEffectsActions.dragStartSelectionBox.type
  ) {
    undoStack.pop();
  }
  return false;
}
