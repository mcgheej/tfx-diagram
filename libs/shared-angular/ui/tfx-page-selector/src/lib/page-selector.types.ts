// Public API
export interface PageRenameDetails {
  pageIndex: number;
  newTitle: string;
}

export interface MoveResult {
  newPageIndex: number;
  currentPageIndex: number;
}
