import { createFeature, createSelector } from '@ngrx/store';
import { controlFrameFeatureKey } from '@tfx-diagram/electron-renderer-web-context-bridge-api';
import { controlFrameReducer } from './control-frame.reducer';

export const controlFrameFeature = createFeature({
  name: controlFrameFeatureKey,
  reducer: controlFrameReducer,
});

export const {
  name,
  reducer,
  selectHighlightedShapeId,
  selectHighlightFrameStart,
  selectSelectedShapeIds,
  selectSelectionFrameStart,
  selectControlShapes,
  selectDragType,
  selectDragOffset,
  selectSelectionBoxAnchor,
  selectTextEdit,
  selectTextCursorPosition,
  selectConnectionHook,
} = controlFrameFeature;

export const selectNumberOfSelectedShapes = createSelector(
  selectSelectedShapeIds,
  (selectionShapeIds) => {
    return selectionShapeIds.length;
  }
);
