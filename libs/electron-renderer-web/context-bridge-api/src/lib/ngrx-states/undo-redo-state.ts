import { AppState } from './app-state';

export interface UndoRedoState {
  undoStack: AppState[];
  redoStack: AppState[];
}
