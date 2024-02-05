import { createAction, props } from '@ngrx/store';
import { Page } from '@tfx-diagram/electron-renderer-web/shared-types';

export const newSketchbookClick = createAction('[File Menu] New Sketchbook Click');

export const newSketchbookCancel = createAction('[File Menu] New Sketchbook Cancel');

export const newSketchbookCreate = createAction(
  '[File Menu] New Sketchbook Create',
  props<{
    sketchbookTitle: string;
    page: Omit<Page, 'id' | 'firstShapeId' | 'lastShapeId' | 'zoomFactor' | 'windowCentre'>;
  }>()
);

export const openSketchbookClick = createAction('[File Menu] Open Sketchbook Click');

export const saveSketchbookClick = createAction('[File Menu] Save Sketchbook Click');

export const exportSketchbookClick = createAction('[File Menu] Export Sketchbook Click');
