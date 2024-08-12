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
