import { TfxPoint } from '../page-selector.types';

export type XPagePagesChange = { type: 'page.pagesChange'; pages: string[] };
export type XPageSelectedPageChange = {
  type: 'page.selectedPageChange';
  selectedPageIndex: number;
};

export type XTabViewerScroll = { type: 'tabViewer.scroll'; scrollIndexDelta: number };
export type XTabViewerOverflowChange = { type: 'tabViewer.overflowChange'; overflow: boolean };

export type XMoveStartDelay = { type: 'move.startDelay' };
export type XMoveCancel = { type: 'move.cancel' };
export type XMoveMouse = { type: 'move.mouse'; x: number };
export type XMoveComplete = { type: 'move.complete' };
export type XMoveDone = { type: 'move.done' };
export type XMoveScrollLeft = { type: 'move.scrollLeft' };
export type XMoveScrollRight = { type: 'move.scrollRight' };
export type XMoveScroll = { type: 'move.scroll'; scrollIndexDelta: number };
export type XMoveInsertPointChange = {
  type: 'move.insertPointChange';
  newInsertPoint: TfxPoint;
  newInsertPointIndex: number;
};
export type XNop = { type: 'nop' };

export type PageSelectorEvents =
  | XPagePagesChange
  | XPageSelectedPageChange
  | XTabViewerScroll
  | XTabViewerOverflowChange
  | XMoveStartDelay
  | XMoveCancel
  | XMoveMouse
  | XMoveComplete
  | XMoveDone
  | XMoveScrollLeft
  | XMoveScrollRight
  | XMoveScroll
  | XMoveInsertPointChange
  | XNop;
