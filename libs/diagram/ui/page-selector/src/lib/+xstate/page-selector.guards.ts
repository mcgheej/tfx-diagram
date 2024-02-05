// import {
//   xPagesChangedEvent,
//   xTabViewerOverflowChangedEvent,
//   xTabViewerScrollEvent,
// } from './page-selector.constants';
import { getNewScrollIndex } from './helpers';
import {
  PageSelectorEvents,
  PAGES_CHANGE_EVENT,
  TAB_VIEWER_OVERFLOW_CHANGE_EVENT,
  TAB_VIEWER_SCROLL_EVENT,
} from './page-selector.events';
import { PageSelectorContext } from './page-selector.schema';

// Guards
// ----------------------------------------------------------------------------

// Guard associated with the xTabViewerOverflowChangedEvent that passes
// if the tab viewer has not overflowed
export const noTabViewerOverflowGuard = (
  context: PageSelectorContext,
  event: PageSelectorEvents
) => {
  return event.type === TAB_VIEWER_OVERFLOW_CHANGE_EVENT
    ? !event.overflow
    : !context.tabViewerOverflow;
};

// Guard associated with the  xTabViewerOverflowChangedEvent that passes
// if the tab viewer has overflowed
export const tabViewerOverflowGuard = (
  context: PageSelectorContext,
  event: PageSelectorEvents
) => {
  return event.type === TAB_VIEWER_OVERFLOW_CHANGE_EVENT
    ? event.overflow
    : context.tabViewerOverflow;
};

// Guard associated with the xTabViewerScrollEvent that passes if
// the tab viewer has scrolled (page index 0 not in the first visible
// position of the tab viewer)
export const tabViewerScrolledGuard = (
  context: PageSelectorContext,
  event: PageSelectorEvents
) => {
  return event.type === TAB_VIEWER_SCROLL_EVENT
    ? getNewScrollIndex(context, event) > 0
    : context.scrollIndex > 0;
};

// Guard associated with the xTabViewerScrollEvent that passes if
// the tab viewer has not scrolled (page index 0 is in the first visible
// position of the tab viewer)
export const tabViewerNotScrolledGuard = (
  context: PageSelectorContext,
  event: PageSelectorEvents
) => {
  return event.type === TAB_VIEWER_SCROLL_EVENT
    ? getNewScrollIndex(context, event) === 0
    : context.scrollIndex === 0;
};

export const multiplePagesGuard = (context: PageSelectorContext, event: PageSelectorEvents) => {
  return event.type === PAGES_CHANGE_EVENT ? event.pages.length > 1 : context.pages.length > 1;
};

export const singlePageGuard = (context: PageSelectorContext, event: PageSelectorEvents) => {
  return event.type === PAGES_CHANGE_EVENT
    ? event.pages.length === 1
    : context.pages.length === 1;
};
