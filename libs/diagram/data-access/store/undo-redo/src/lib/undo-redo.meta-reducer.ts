/* eslint-disable @typescript-eslint/no-explicit-any */
import { ActionReducer } from '@ngrx/store';
import {
  ControlFrameEffectsActions,
  DiagramCanvasDirectiveActions,
} from '@tfx-diagram/diagram-data-access-store-actions';

export const undoRedoMetaReducer = (reducer: ActionReducer<any>) => {
  return (state: any, action: any) => {
    if (action.type !== DiagramCanvasDirectiveActions.mouseMoveOnViewport.type) {
      // if (action.type === ControlFrameEffectsActions.selectionChange.type) {
      if (action.type === ControlFrameEffectsActions.dragEndSelectionBox.type) {
        console.log(action);
        console.log(state);
      }
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
