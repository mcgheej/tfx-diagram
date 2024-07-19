/* eslint-disable @typescript-eslint/no-explicit-any */
import { ActionReducer } from '@ngrx/store';
import {
  EditMenuActions,
  PageViewportComponentActions,
} from '@tfx-diagram/diagram-data-access-store-actions';
import { AppState } from '@tfx-diagram/electron-renderer-web-context-bridge-api';
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
    if (undoableOperationTriggerActions[actionType]) {
      pushUndo(state, actionType);
      clearRedoStack();
    } else if (actionType === EditMenuActions.undoClick.type) {
      const poppedState = popUndo();
      if (poppedState) {
        pushRedo(state, actionType);
        return reducer(poppedState.state, action);
      }
    } else if (actionType === EditMenuActions.redoClick.type) {
      const poppedState = popRedo();
      if (poppedState) {
        pushUndo(state, actionType);
        return reducer(poppedState.state, action);
      }
    } else if (actionType === PageViewportComponentActions.viewportSizeChange.type) {
      clearUndoStack();
      clearRedoStack();
    }
    // if (action.type !== DiagramCanvasDirectiveActions.mouseMoveOnViewport.type) {
    //   console.log(state);
    // }
    return reducer(state, action);
    // if (action.type !== DiagramCanvasDirectiveActions.mouseMoveOnViewport.type) {
    //   // if (action.type === ControlFrameEffectsActions.selectionChange.type) {
    //   if (action.type === ControlFrameEffectsActions.dragEndSelectionBox.type) {
    //     console.log(action);
    //     console.log(state);
    //   }
    // }
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

// function logStacks() {
//   console.log(undoStack);
//   console.log(redoStack);
// }
