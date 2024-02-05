import { TfxPoint } from '../page-selector.types';

export const PAGES_CHANGE_EVENT = 'PAGES_CHANGE_EVENT';
export const SELECTED_PAGE_CHANGE_EVENT = 'SELECTED_PAGE_CHANGE_EVENT';
export const TAB_VIEWER_SCROLL_EVENT = 'TAB_VIEWER_SCROLL_EVENT';
export const TAB_VIEWER_OVERFLOW_CHANGE_EVENT = 'TAB_VIEWER_OVERFLOW_CHANGE_EVENT';
export const MOVE_START_DELAY_EVENT = 'MOVE_START_DELAY_EVENT';
export const MOVE_CANCEL_EVENT = 'MOVE_CANCEL_EVENT';
export const MOVE_MOUSE_MOVE_EVENT = 'MOVE_MOUSE_MOVE_EVENT';
export const MOVE_COMPLETE_EVENT = 'MOVE_COMPLETE_EVENT';
export const MOVE_SCROLL_LEFT_EVENT = 'MOVE_SCROLL_LEFT_EVENT';
export const MOVE_SCROLL_RIGHT_EVENT = 'MOVE_SCROLL_RIGHT_EVENT';
export const MOVE_SCROLL_EVENT = 'MOVE_SCROLL_EVENT';
export const MOVE_INSERT_POINT_CHANGE_EVENT = 'MOVE_INSERT_POINT_CHANGE_EVENT';

//---------
export class PagesChangeEvent {
  readonly type = PAGES_CHANGE_EVENT;
  constructor(public pages: string[]) {}
}

export class SelectedPageChangeEvent {
  readonly type = SELECTED_PAGE_CHANGE_EVENT;
  constructor(public selectedPageIndex: number) {}
}

export class TabViewerScrollEvent {
  readonly type = TAB_VIEWER_SCROLL_EVENT;
  constructor(public scrollIndexDelta: number) {}
}

export class TabViewerOverflowChangeEvent {
  readonly type = TAB_VIEWER_OVERFLOW_CHANGE_EVENT;
  constructor(public overflow: boolean) {}
}

export class MoveStartDelayEvent {
  readonly type = MOVE_START_DELAY_EVENT;
}

export class MoveCancelEvent {
  readonly type = MOVE_CANCEL_EVENT;
}

export class MoveMouseMoveEvent {
  readonly type = MOVE_MOUSE_MOVE_EVENT;
  constructor(public x: number) {}
}

export class MoveCompleteEvent {
  readonly type = MOVE_COMPLETE_EVENT;
}

export class MoveScrollLeftEvent {
  readonly type = MOVE_SCROLL_LEFT_EVENT;
}

export class MoveScrollRightEvent {
  readonly type = MOVE_SCROLL_RIGHT_EVENT;
}

export class MoveScrollEvent {
  readonly type = MOVE_SCROLL_EVENT;
  constructor(public scrollIndexDelta: number) {}
}

export class MoveInsertPointChangeEvent {
  readonly type = MOVE_INSERT_POINT_CHANGE_EVENT;
  constructor(public newInsertPoint: TfxPoint, public newInsertPointIndex: number) {}
}

export type PageSelectorEvents =
  | PagesChangeEvent
  | SelectedPageChangeEvent
  | TabViewerScrollEvent
  | TabViewerOverflowChangeEvent
  | MoveStartDelayEvent
  | MoveCancelEvent
  | MoveMouseMoveEvent
  | MoveCompleteEvent
  | MoveScrollLeftEvent
  | MoveScrollRightEvent
  | MoveScrollEvent
  | MoveInsertPointChangeEvent;
