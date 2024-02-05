// Public API
export interface PageRenameDetails {
  pageIndex: number;
  newTitle: string;
}

export interface MoveResult {
  newPageIndex: number;
  currentPageIndex: number;
}

// Page Selector Internal

export interface ScrollData {
  leftDisabled: boolean;
  rightDisabled: boolean;
  scrollIndex: number;
}

export interface MoveResult {
  newPageIndex: number;
  currentPageIndex: number;
}

export interface TfxPoint {
  x: number;
  y: number;
}
