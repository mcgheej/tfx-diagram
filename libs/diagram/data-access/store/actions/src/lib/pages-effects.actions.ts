import { createAction, props } from '@ngrx/store';
import { SketchbookFileData } from '@tfx-diagram/electron-renderer-web-context-bridge-api';
import { Page } from '@tfx-diagram/electron-renderer-web/shared-types';

export const newPageReady = createAction(
  '[Page Effects] New Page Ready',
  props<{ page: Page }>()
);

export const currentPageChange = createAction('[Pages Effects] Current Page Change');

export const pageAdded = createAction('[Pages Effects] Page Added', props<{ page: Page }>());
export const sketchbookClose = createAction('[Pages Effects] Sketchbook Close');

export const openSuccess = createAction(
  '[Pages Effects] openSuccess',
  props<{ fileData: SketchbookFileData }>()
);
