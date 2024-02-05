import { createAction, props } from '@ngrx/store';
import { MoveResult } from '@tfx-diagram/diagram/ui/page-selector';
import { ZoomSelectType } from '@tfx-diagram/diagram/ui/zoom-control';
import { Page, PageFormats, PageLayout } from '@tfx-diagram/electron-renderer-web/shared-types';
import { Size } from 'electron';

export const zoomChange = createAction(
  '[Sketchbook View Component] Zoom Change',
  props<{ zoomSelected: ZoomSelectType }>()
);

export const addPageClick = createAction('[Sketchbook View Component] Add Page Click');

export const addPageConfirmed = createAction(
  '[Sketchbook View Component] Add Page Confirmed',
  props<{ size: Size; format: PageFormats; layout: PageLayout }>()
);

export const addPageCancel = createAction('[Sketchbook View Component] Add Page Cancel');

export const currentPageChange = createAction(
  '[Sketchbook View Component] Current Page Change',
  props<{ newCurrentPageIndex: number }>()
);

export const deletePageClick = createAction(
  '[Sketchbook View Component] Delete Page Click',
  props<{ pageIndex: number; page: Page }>()
);

export const pageOrderChange = createAction(
  '[Sketchbook View Component] Page Order Change',
  props<{ move: MoveResult }>()
);

export const pageTitleChange = createAction(
  '[Sketchbook View Component] Page Title Change',
  props<{ pageId: string; newTitle: string }>()
);
