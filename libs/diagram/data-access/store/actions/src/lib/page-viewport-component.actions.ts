import { createAction, props } from '@ngrx/store';
import { Size } from '@tfx-diagram/electron-renderer-web/shared-types';
import { Rect } from '@tfx-diagram/shared-angular/utils/shared-types';

export const viewportSizeChange = createAction(
  '[Page Viewport Component] Viewport Size Change',
  props<{ newSize: Size | null }>()
);

export const scrolling = createAction(
  '[Page Viewport Component] Scrolling',
  props<{ pageId: string; newWindow: Rect }>()
);

export const scrollChange = createAction(
  '[Page Viewport Component] Scroll Change',
  props<{ pageId: string; newWindow: Rect }>()
);
