import { createAction, props } from '@ngrx/store';
import { SettingsState } from '@tfx-diagram/electron-renderer-web-context-bridge-api';
import {
  Alignment,
  MousePositionCoordsType,
} from '@tfx-diagram/electron-renderer-web/shared-types';

export const showRulersToggle = createAction('[Settings Effects] Show Rulers Toggle');

export const showShapeInspectorToggle = createAction(
  '[Settings Effects] Show Shape Inspector Toggle'
);

export const shapeSnapToggle = createAction('[Settings Effects] Shape Snap Toggle');

export const showMousePositionToggle = createAction(
  '[Settings Effects] Show Mouse Position Toggle'
);

export const mousePositionCoordsTypeChange = createAction(
  '[Settings Effects] Mouse Position Coords Type Change',
  props<{ value: MousePositionCoordsType }>()
);

export const showGridToggle = createAction('[Settings Effects] Show Grid Toggle');

export const snapToGridToggle = createAction('[Settings Effects] Snap To Grid Toggle');

export const pageAlignmentChange = createAction(
  '[Settings Effects] Set Page Alignment',
  props<{ alignment: Alignment }>()
);

export const screenPixelDensityChange = createAction(
  '[Settings Effects] Screen Pixel Density Change',
  props<{ value: number }>()
);

export const jpegQualityChange = createAction(
  '[Settings Effects] Jpeg Quality Change',
  props<{ quality: number }>()
);

export const appStart = createAction(
  '[Settings Effects] AppStart',
  props<{ changes: Partial<SettingsState> }>()
);
