import { createReducer } from '@ngrx/store';
import { UndoRedoState } from '@tfx-diagram/electron-renderer-web-context-bridge-api';

export const initialState: UndoRedoState = {
  undoStack: [],
  redoStack: [],
};

export const undoRedoReducer = createReducer(initialState);
