import { createReducer, on } from '@ngrx/store';
import {
  PagesEffectsActions,
  PageViewportComponentActions,
  ShapesEffectsActions,
  SketchbookEffectsActions,
  SketchbookViewComponentActions,
  TransformEffectsActions,
} from '@tfx-diagram/diagram-data-access-store-actions';
import { PagesState } from '@tfx-diagram/electron-renderer-web-context-bridge-api';

export const initialState: PagesState = {
  pages: {},
  pageIds: [],
  currentPageId: '',
};

export const pagesReducer = createReducer(
  initialState,
  on(
    SketchbookEffectsActions.newPageReady,
    PagesEffectsActions.newPageReady,
    (state, { page }) => {
      const newPages = { ...state.pages };
      newPages[page.id] = page;
      return {
        ...state,
        pages: newPages,
        pageIds: [...state.pageIds, page.id],
        currentPageId: page.id,
      };
    }
  ),
  on(SketchbookViewComponentActions.currentPageChange, (state, { newCurrentPageIndex }) => {
    if (newCurrentPageIndex >= 0 && newCurrentPageIndex < state.pageIds.length) {
      return {
        ...state,
        currentPageId: state.pageIds[newCurrentPageIndex],
      };
    }
    return { ...state };
  }),
  on(SketchbookViewComponentActions.pageOrderChange, (state, { move }) => {
    const { currentPageIndex, newPageIndex } = move;
    if (
      currentPageIndex < 0 ||
      newPageIndex < 0 ||
      currentPageIndex >= state.pageIds.length ||
      newPageIndex >= state.pageIds.length ||
      currentPageIndex === move.newPageIndex
    ) {
      return state;
    }
    const movingPageId = state.pageIds[currentPageIndex];
    let pageIds = [
      ...state.pageIds.slice(0, currentPageIndex),
      ...state.pageIds.slice(currentPageIndex + 1),
    ];
    pageIds = [...pageIds.slice(0, newPageIndex), movingPageId, ...pageIds.slice(newPageIndex)];
    return {
      ...state,
      pageIds,
    };
  }),
  on(SketchbookEffectsActions.deletePageClick, (state, { page }) => {
    if (state.pages[page.id]) {
      const pageIndex = state.pageIds.indexOf(page.id);
      const pageIds = [...state.pageIds];
      pageIds.splice(pageIndex, 1);
      const pages = { ...state.pages };
      delete pages[page.id];
      const currentPageId =
        pageIndex >= pageIds.length ? pageIds[pageIds.length - 1] : pageIds[pageIndex];
      return {
        ...state,
        pages,
        pageIds,
        currentPageId,
      };
    }
    return state;
  }),
  on(SketchbookEffectsActions.pagesClose, (state) => {
    return {
      ...state,
      pages: {},
      pageIds: [],
      currentPageId: '',
    };
  }),
  on(SketchbookEffectsActions.openSuccess, (state, { fileData }) => {
    return {
      ...fileData.pages,
      // ...state,
      // pages: fileData.pages.pages,
      // pageIds: fileData.pages.pageIds,
      // currentPageId: fileData.pages.currentPageId,
    };
  }),
  on(
    TransformEffectsActions.pageWindowChange,
    PageViewportComponentActions.scrolling,
    PageViewportComponentActions.scrollChange,
    (state, { pageId, newWindow }) => {
      if (state.pages[pageId]) {
        return {
          ...state,
          pages: {
            ...state.pages,
            [pageId]: {
              ...state.pages[pageId],
              windowCentre: {
                x: newWindow.x + newWindow.width / 2,
                y: newWindow.y + newWindow.height / 2,
              },
            },
          },
        };
      }
      return state;
    }
  ),
  on(TransformEffectsActions.zoomChange, (state, { pageId, zoomFactor }) => {
    if (state.pages[pageId]) {
      return {
        ...state,
        pages: {
          ...state.pages,
          [pageId]: {
            ...state.pages[pageId],
            zoomFactor,
          },
        },
      };
    }
    return state;
  }),
  on(SketchbookViewComponentActions.pageTitleChange, (state, { pageId, newTitle }) => {
    if (state.pages[pageId]) {
      return {
        ...state,
        pages: {
          ...state.pages,
          [pageId]: {
            ...state.pages[pageId],
            title: newTitle,
          },
        },
      };
    }
    return state;
  }),
  on(ShapesEffectsActions.firstShapeOnPage, (state, { shape, pageId }) => {
    return {
      ...state,
      pages: {
        ...state.pages,
        [pageId]: {
          ...state.pages[pageId],
          firstShapeId: shape.id,
          lastShapeId: shape.id,
        },
      },
    };
  }),
  on(
    ShapesEffectsActions.anotherShapeOnPage,
    ShapesEffectsActions.duplicatedShapesOnPage,
    ShapesEffectsActions.pasteShapesOnPage,
    (state, { shapes, pageId }) => {
      // shapes:  Shape[] - contains three sections:
      //          section 1 - new drawable shapes copied from existing shapes
      //                      in a selection (duplicate). There will be 1 or more
      //                      shapes in this section.
      //          section 2 - new group shapes copied from existing group
      //                      shapes in a selection. There will be 0 or more
      //                      shapes in this section.
      //          section 3 - modified last shape. This section will be empty
      //                      if the drawable shapes are being added to an empty
      //                      page (lastShapeId = empty string), otherwise it will
      //                      contain a single drawable shape which is the previous
      //                      last shape in the page's drawing chain modified to
      //                      point to the first drawable shape in section 1.
      //
      if (shapes.length === 0) {
        return state;
      }
      if (state.pages[pageId]) {
        const firstShapeId = state.pages[pageId].firstShapeId;
        const lastShapeId = state.pages[pageId].lastShapeId;

        if (shapes.length === 1) {
          // Only one shape so this is adding a drawable shape to the page's
          // drawing chain.
          return {
            ...state,
            pages: {
              ...state.pages,
              [pageId]: {
                ...state.pages[pageId],
                lastShapeId: shapes[0].id,
                firstShapeId: firstShapeId ? firstShapeId : shapes[0].id,
              },
            },
          };
        }

        // Need to find the index of last shape in section 1.
        let start = shapes.length - 1;
        if (lastShapeId) {
          // Section 3 has a shape so adjust start position to skip it.
          start--;
        }
        for (let i = start; i >= 0; i--) {
          if (shapes[i].shapeType !== 'group') {
            return {
              ...state,
              pages: {
                ...state.pages,
                [pageId]: {
                  ...state.pages[pageId],
                  lastShapeId: shapes[i].id,
                  firstShapeId: firstShapeId ? firstShapeId : shapes[0].id,
                },
              },
            };
          }
        }
      }
      return state;
    }
  ),
  on(
    ShapesEffectsActions.deleteShapesOnPage,
    ShapesEffectsActions.bringToFront,
    ShapesEffectsActions.sendToBack,
    ShapesEffectsActions.bringItemForward,
    ShapesEffectsActions.sendItemBackward,
    (state, { pageId, firstShapeId, lastShapeId }) => {
      return {
        ...state,
        pages: {
          ...state.pages,
          [pageId]: {
            ...state.pages[pageId],
            firstShapeId,
            lastShapeId,
          },
        },
      };
    }
  )
);
