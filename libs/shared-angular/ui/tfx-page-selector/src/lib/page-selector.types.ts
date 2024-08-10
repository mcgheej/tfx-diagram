// Public API
export interface PageRenameDetails {
  pageIndex: number;
  newTitle: string;
}

export interface MoveResult {
  newPageIndex: number;
  currentPageIndex: number;
}

export interface PageTabClickData {
  pageIndex: number;
  button: 'left' | 'right';
}

export interface TfxPoint {
  x: number;
  y: number;
}
