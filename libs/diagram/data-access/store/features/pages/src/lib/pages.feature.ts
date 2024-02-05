import { createFeature, createSelector } from '@ngrx/store';
import { pagesFeatureKey } from '@tfx-diagram/electron-renderer-web-context-bridge-api';
import { Page } from '@tfx-diagram/electron-renderer-web/shared-types';
import { pagesReducer } from './pages.reducer';

export const pagesFeature = createFeature({
  name: pagesFeatureKey,
  reducer: pagesReducer,
});

export const {
  name,
  reducer,
  selectPagesState,
  selectPages,
  selectPageIds,
  selectCurrentPageId,
} = pagesFeature;

export const selectCurrentPage = createSelector(
  selectCurrentPageId,
  selectPages,
  (id, pages) => {
    if (id && pages[id]) {
      return pages[id];
    }
    return null;
  }
);

export const selectPageData = createSelector(
  selectCurrentPageId,
  selectPages,
  selectPageIds,
  (currentPageId, pages, pageIds) => {
    if (currentPageId && pages[currentPageId] && pageIds.length > 0) {
      const pageArray: Page[] = [];
      let currentIdx = -1;
      let i = 0;
      for (const pageId of pageIds) {
        if (pages[pageId]) {
          if (pageId === currentPageId) {
            currentIdx = i;
          }
          pageArray.push(pages[pageId]);
          i++;
        }
      }
      return {
        pages: pageArray,
        currentIdx,
      };
    }
    return {
      pages: [] as Page[],
      currentIdx: -1,
    };
  }
);
