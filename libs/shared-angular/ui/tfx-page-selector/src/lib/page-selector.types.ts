// Public API Types
export interface PageRenameDetails {
  pageIndex: number;
  newTitle: string;
}

export interface MoveResult {
  newPageIndex: number;
  currentPageIndex: number;
}

// Page Selector Types
export interface PageTabClickData {
  pageIndex: number;
  button: 'left' | 'right';
}

export interface TfxPoint {
  x: number;
  y: number;
}

export type TabVisibilityStatus = 'hidden' | 'partially-visible' | 'visible';
export type ViewerAlignment = 'left' | 'right';

export interface PageTab {
  refX: number;
  refY: number;
  width: number;
  left: number;
  visibilityStatus: TabVisibilityStatus;
}

export interface PageTabsViewerVM {
  align: ViewerAlignment;
  firstVisibleIdx: number;
  lastVisibleIdx: number;
  scrolled: boolean;
  overflowed: boolean;
}
