import { createAction } from '@ngrx/store';

export const saveUndoRedo = createAction('[Undo/Redo] SAVE');

export const clearUndoRedo = createAction('[Undo/Redo] CLEAR');
