import { createFeature } from '@ngrx/store';
import { undoRedoReducer } from './undo-redo.reducer';

export const undoRedoFeature = createFeature({
  name: 'undoRedo',
  reducer: undoRedoReducer,
});

export const { name, reducer, selectUndoRedoState, selectPast, selectPresent, selectFuture } =
  undoRedoFeature;
