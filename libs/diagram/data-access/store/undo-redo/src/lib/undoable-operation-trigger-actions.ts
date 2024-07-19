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
};
