import { createAction, props } from '@ngrx/store';
import { ZoomSelectType } from '@tfx-diagram/diagram/ui/zoom-control';
import {
  Alignment,
  MousePositionCoordsType,
} from '@tfx-diagram/electron-renderer-web/shared-types';

export const showRulersToggle = createAction('[View Menu] Show Rulers Toggle');

export const showShapeInspectorToggle = createAction('[View Menu] Show Shape Inspector Toggle');

export const shapeSnapToggle = createAction('[View Menu] Shape Snap Toggle');

export const showMousePositionToggle = createAction('[View Menu] Show Mouse Position Toggle');

export const mousePositionCoordsTypeChange = createAction(
  '[View Menu] Mouse Position Coords Type Change',
  props<{ value: MousePositionCoordsType }>()
);

export const showGridToggle = createAction('[View Menu] Show Grid Toggle');

export const snapToGridToggle = createAction('[View Menu] Snap To Grid Toggle');

export const pageAlignmentChange = createAction(
  '[View Menu] Page Alignment Change',
  props<{ value: Partial<Alignment> }>()
);

export const screenPixelDensityChange = createAction(
  '[View Menu] Screen Pixel Density Change',
  props<{ value: number }>()
);

export const zoomChange = createAction(
  '[Sketchbook View Component] Zoom Change',
  props<{ zoomSelected: ZoomSelectType }>()
);
