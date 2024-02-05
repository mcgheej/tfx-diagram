import { createFeature, createSelector } from '@ngrx/store';
import { sketchbookFeatureKey } from '@tfx-diagram/electron-renderer-web-context-bridge-api';
import { sketchbookReducer } from './sketchbook.reducer';

export const sketchbookFeature = createFeature({
  name: sketchbookFeatureKey,
  reducer: sketchbookReducer,
});

export const {
  name,
  reducer,
  selectSketchbookState,
  selectTitle,
  selectPath,
  selectStatus,
  selectDialogOpen,
  selectExportStatus,
} = sketchbookFeature;

export const selectModifiedTitle = createSelector(
  selectTitle,
  selectStatus,
  (title, status) => {
    switch (status) {
      case 'creating':
      case 'loading':
      case 'closed': {
        return 'Diagram';
      }
      case 'saved': {
        return `${title} - Diagram`;
      }
      default: {
        return `\u25cf ${title} - Diagram`;
      }
    }
  }
);
