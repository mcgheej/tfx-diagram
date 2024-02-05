import { createAction, props } from '@ngrx/store';
import { Size, Transform } from '@tfx-diagram/electron-renderer-web/shared-types';
import { Rect } from '@tfx-diagram/shared-angular/utils/shared-types';

export const pageWindowChange = createAction(
  '[Transform Effects] Page Window Change',
  props<{ pageId: string; pageSize: Size; newWindow: Rect }>()
);

export const transformChange = createAction(
  '[Transform Effects] Transform Change',
  props<{ transform: Transform }>()
);

export const zoomChange = createAction(
  '[Transform Effects] Zoom Change',
  props<{ pageId: string; zoomFactor: number }>()
);
