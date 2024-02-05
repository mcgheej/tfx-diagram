import { TabViewerScrollEvent } from './page-selector.events';
import { PageSelectorContext } from './page-selector.schema';

export const getNewScrollIndex = (
  context: PageSelectorContext,
  event: TabViewerScrollEvent
) => {
  let newScrollIndex = context.scrollIndex + event.scrollIndexDelta;
  if (newScrollIndex < 0) {
    newScrollIndex = 0;
  } else if (newScrollIndex > context.pages.length - 1) {
    newScrollIndex = context.pages.length - 1;
  }
  return newScrollIndex;
};
