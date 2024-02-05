import { actions } from 'xstate';
import { getNewScrollIndex } from './helpers';
import {
  PagesChangeEvent,
  PageSelectorEvents,
  SelectedPageChangeEvent,
  TabViewerOverflowChangeEvent,
  TabViewerScrollEvent,
} from './page-selector.events';
import { PageSelectorContext } from './page-selector.schema';

const { assign } = actions;

// ----------------------------------------------------------------------------

// Transition action associated with xPagesChangedEvent
export const pagesChangeAction = assign<PageSelectorContext, PageSelectorEvents>(
  (context, e) => {
    const event = e as PagesChangeEvent;
    return {
      pages: event.pages.length > 0 ? event.pages : context.pages,
    };
  }
);

export const selectedPageChangedAction = assign<PageSelectorContext, PageSelectorEvents>(
  (context, e) => {
    const event = e as SelectedPageChangeEvent;
    return {
      selectedPageIndex: event.selectedPageIndex,
    };
  }
);

// Transition action associated with the xTabViewerOverflowChangedEvent
export const tabViewerOverflowChangedAction = assign<PageSelectorContext, PageSelectorEvents>(
  (context, e) => {
    const event = e as TabViewerOverflowChangeEvent;
    return {
      tabViewerOverflow: event.overflow,
    };
  }
);

// Transition action associated with the xTabViewerScrollEvent
export const tabViewerScrollAction = assign<PageSelectorContext, PageSelectorEvents>(
  (context, e) => {
    const event = e as TabViewerScrollEvent;
    return {
      scrollIndex: getNewScrollIndex(context, event),
    };
  }
);
