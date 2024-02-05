import { createAction, props } from '@ngrx/store';
import {
  SaveFileResult,
  SketchbookFileData,
} from '@tfx-diagram/electron-renderer-web-context-bridge-api';
import { Page } from '@tfx-diagram/electron-renderer-web/shared-types';

export const newPageReady = createAction(
  '[Sketchbook Effects] New Page Ready',
  props<{ page: Page }>()
);

export const pagesClose = createAction('[Sketchbook Effects] Pages Close');

export const currentPageChange = createAction('[Sketchbook Effects] Current Page Change');

export const deletePageClick = createAction(
  '[Sketchbook Effects] Delete Page Click',
  props<{ page: Page }>()
);

// ------------------------------------------
export const openCancel = createAction('[Sketchbook Effects] Open Cancel');

export const openError = createAction('[Sketchbook Effects] Open Error');

export const openSuccess = createAction(
  '[Sketchbook Effects] Open Success',
  props<{ fileData: SketchbookFileData }>()
);

// ------------------------------------------
export const saveCancel = createAction('[Sketchbook Effects] Save Cancel');

export const saveError = createAction('[Sketchbook Effects] Save Error');

export const saveSuccess = createAction(
  // export const fileSaved = createAction(
  '[Sketchbook Effects] Save Success',
  props<{ result: SaveFileResult }>()
);

// ------------------------------------------
export const exportError = createAction('[Sketchbook Effects] Export Error');
export const exportSuccess = createAction('[Sketchbook Effects] Export Success');
