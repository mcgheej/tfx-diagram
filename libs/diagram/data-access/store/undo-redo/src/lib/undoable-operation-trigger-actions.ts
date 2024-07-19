import {
  SketchbookViewComponentActions,
  ViewMenuActions,
} from '@tfx-diagram/diagram-data-access-store-actions';

export const undoableOperationTriggerActions: { [id: string]: boolean } = {
  [SketchbookViewComponentActions.addPageConfirmed.type]: true,
  [SketchbookViewComponentActions.pageTitleChange.type]: true,
  [SketchbookViewComponentActions.pageOrderChange.type]: true,
  [SketchbookViewComponentActions.deletePageClick.type]: true,
  [SketchbookViewComponentActions.currentPageChange.type]: true,
  [ViewMenuActions.pageAlignmentChange.type]: true,
  [ViewMenuActions.shapeSnapToggle.type]: true,
  [ViewMenuActions.showMousePositionToggle.type]: true,
  [ViewMenuActions.mousePositionCoordsTypeChange.type]: true,
  [ViewMenuActions.showGridToggle.type]: true,
  [ViewMenuActions.snapToGridToggle.type]: true,
  [ViewMenuActions.screenPixelDensityChange.type]: true,
  [ViewMenuActions.zoomChange.type]: true,
  [SketchbookViewComponentActions.zoomChange.type]: true,
};
