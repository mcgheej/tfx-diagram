import { createReducer, on } from '@ngrx/store';
import {
  DiagramCanvasDirectiveActions,
  PagesEffectsActions,
  PageViewportComponentActions,
  TransformEffectsActions,
} from '@tfx-diagram/diagram-data-access-store-actions';
import { TransformState } from '@tfx-diagram/electron-renderer-web-context-bridge-api';

export const initialState: TransformState = {
  pageViewport: null,
  pageWindow: null,
  pageSize: null,
  viewportMouseCoords: { x: 0, y: 0 },
  transform: null,
};

export const transformReducer = createReducer(
  initialState,
  on(PageViewportComponentActions.viewportSizeChange, (state, { newSize }) => {
    return {
      ...state,
      pageViewport: newSize
        ? {
            x: 0,
            y: 0,
            width: newSize.width,
            height: newSize.height,
          }
        : null,
    };
  }),
  on(TransformEffectsActions.pageWindowChange, (state, { newWindow, pageSize }) => {
    return {
      ...state,
      pageWindow: newWindow,
      pageSize,
    };
  }),
  on(
    PageViewportComponentActions.scrolling,
    PageViewportComponentActions.scrollChange,
    (state, { newWindow }) => {
      return {
        ...state,
        pageWindow: newWindow,
      };
    }
  ),
  on(TransformEffectsActions.transformChange, (state, { transform }) => {
    return {
      ...state,
      transform,
    };
  }),
  on(PagesEffectsActions.sketchbookClose, (state) => {
    return {
      ...state,
      transform: null,
      pageWindow: null,
      pageSize: null,
    };
    // return initialState;
  }),
  on(DiagramCanvasDirectiveActions.mouseMoveOnViewport, (state, { coords }) => {
    return {
      ...state,
      viewportMouseCoords: coords,
    };
  })
);
