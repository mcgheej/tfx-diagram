import { createReducer } from '@ngrx/store';
import { pagesInitialState } from '@tfx-diagram/diagram-data-access-store-features-pages';
import { sketchbookInitialState } from '@tfx-diagram/diagram-data-access-store-features-sketchbook';
import { UndoRedoHistory } from '@tfx-diagram/electron-renderer-web-context-bridge-api';

export const initialState: UndoRedoHistory = {
  past: [],
  present: {
    sketchbook: sketchbookInitialState,
    pages: pagesInitialState,
    shapeObjects: [],
    connectionObjects: [],
    customColors: {},
    customColorIds: [],
  },
  future: [],
};

export const undoRedoReducer = createReducer(initialState);
