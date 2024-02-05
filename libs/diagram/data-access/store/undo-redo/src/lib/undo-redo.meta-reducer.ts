/* eslint-disable @typescript-eslint/no-explicit-any */
import { ActionReducer } from '@ngrx/store';
import { DiagramCanvasDirectiveActions } from '@tfx-diagram/diagram-data-access-store-actions';
import { pagesInitialState } from '@tfx-diagram/diagram-data-access-store-features-pages';
import { sketchbookInitialState } from '@tfx-diagram/diagram-data-access-store-features-sketchbook';
import { UndoRedoHistory } from '@tfx-diagram/electron-renderer-web-context-bridge-api';

const bufferLimit = 10;

const emptyHistory: UndoRedoHistory = {
  past: [],
  present: {
    sketchbook: sketchbookInitialState,
    pages: pagesInitialState,
    shapeObjects: [],
    connectionObjects: [],
  },
  future: [],
};

let history = emptyHistory;

export const undoRedoMetaReducer = (reducer: ActionReducer<any>) => {
  return (state: any, action: any) => {
    if (action.type !== DiagramCanvasDirectiveActions.mouseMoveOnViewport.type) {
      console.log(action);
    }
    return reducer(state, action);
    // switch (action.type) {
    //   case SketchbookEffectsActions.saveSuccess:
    //   case PagesEffectsActions.sketchbookClose.type: {
    //     history = emptyHistory;
    //     // console.log(history);
    //     return reducer(state, action);
    //   }

    //   case UndoRedoActions.saveUndoRedo.type: {
    //     return addUndo(state, action, reducer);
    //   }

    //   default: {
    //     return reducer(state, action);
    //   }
    // }
  };
};

const addUndo = (state: any, action: any, reducer: ActionReducer<any>) => {
  const newPresentState = reducer(state, action);
  if (Object.keys(history.present.pages.pages).length === 0) {
    history = {
      past: [],
      present: newPresentState,
      future: [],
    };
  } else {
    if (history.past.length >= bufferLimit) {
      history.past = history.past.slice(0, -1);
    }
    history = {
      past: [history.present, ...history.past],
      present: {
        sketchbook: newPresentState.sketchbook,
        pages: newPresentState.pages,
        shapeObjects: [],
        connectionObjects: [],
      },
      future: [], // clear future
    };
  }
  // console.log(history);
  return newPresentState;
};
