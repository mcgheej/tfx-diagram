import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import {
  PageViewportComponentActions,
  PagesEffectsActions,
  SettingsEffectsActions,
  SketchbookEffectsActions,
  SketchbookViewComponentActions,
  TransformEffectsActions,
  ViewMenuActions,
} from '@tfx-diagram/diagram-data-access-store-actions';
import { selectCurrentPage } from '@tfx-diagram/diagram-data-access-store-features-pages';
import {
  selectPageAlignmentInViewport,
  selectScreenPixelDensity,
} from '@tfx-diagram/diagram-data-access-store-features-settings';
import { ZoomSelectType } from '@tfx-diagram/diagram/ui/zoom-control';
import { getRectSize, greaterThan, lessThan } from '@tfx-diagram/diagram/util/misc-functions';
import {
  Alignment,
  INITIAL_ZOOM_FACTOR,
  Page,
  Size,
} from '@tfx-diagram/electron-renderer-web/shared-types';
import { Rect } from '@tfx-diagram/shared-angular/utils/shared-types';
import { filter, of, switchMap } from 'rxjs';
import { selectPageViewport } from './transform.feature';

@Injectable()
export class TransformEffects {
  alignmentChange$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SettingsEffectsActions.pageAlignmentChange),
      concatLatestFrom(() => [
        this.store.select(selectCurrentPage),
        this.store.select(selectPageViewport),
        this.store.select(selectScreenPixelDensity),
      ]),
      filter(([, currentPage, viewport]) => {
        return currentPage !== null && viewport !== null;
      }),
      switchMap(([{ alignment }, currentPage, viewport, spd]) => {
        const page = currentPage as Page;
        const viewportSize = getRectSize(viewport as Rect);
        return of(
          TransformEffectsActions.pageWindowChange({
            newWindow: this.calcPageWindow(viewportSize, page, alignment, spd),
            pageId: page.id,
            pageSize: page.size,
          })
        );
      })
    );
  });

  screenPixelDensityChange$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SettingsEffectsActions.screenPixelDensityChange),
      concatLatestFrom(() => [
        this.store.select(selectCurrentPage),
        this.store.select(selectPageViewport),
        this.store.select(selectPageAlignmentInViewport),
      ]),
      filter(([, currentPage, viewport]) => {
        return currentPage !== null && viewport !== null;
      }),
      switchMap(([{ value: spd }, currentPage, viewport, alignment]) => {
        const page = currentPage as Page;
        const viewportSize = getRectSize(viewport as Rect);
        return of(
          TransformEffectsActions.pageWindowChange({
            newWindow: this.calcPageWindow(viewportSize, page, alignment, spd),
            pageId: page.id,
            pageSize: page.size,
          })
        );
      })
    );
  });

  /**
   *
   */
  viewportSizeChange$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PageViewportComponentActions.viewportSizeChange),
      concatLatestFrom(() => [
        this.store.select(selectCurrentPage),
        this.store.select(selectPageAlignmentInViewport),
        this.store.select(selectScreenPixelDensity),
      ]),
      filter(([{ newSize }, currentPage]) => {
        return currentPage !== null && newSize !== null;
      }),
      switchMap(([{ newSize }, currentPage, alignment, spd]) => {
        const page = currentPage as Page;
        const viewportSize = newSize as Size;
        return of(
          TransformEffectsActions.pageWindowChange({
            newWindow: this.calcPageWindow(viewportSize, page, alignment, spd),
            pageId: page.id,
            pageSize: page.size,
          })
        );
      })
    );
  });

  zoomSelected$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SketchbookViewComponentActions.zoomChange, ViewMenuActions.zoomChange),
      concatLatestFrom(() => [
        this.store.select(selectCurrentPage),
        this.store.select(selectPageViewport),
        this.store.select(selectScreenPixelDensity),
      ]),
      filter(([, currentPage, viewport]) => {
        return currentPage !== null && viewport !== null;
      }),
      switchMap(([{ zoomSelected }, page, viewport, spd]) => {
        let zoomFactor = INITIAL_ZOOM_FACTOR;
        if (zoomSelected !== 'fit-to-width' && zoomSelected !== 'fit-to-window') {
          zoomFactor = zoomSelected;
        } else if (page && viewport) {
          zoomFactor = this.calcFittedZoom(zoomSelected, viewport, page.size, spd);
        }
        return of(
          TransformEffectsActions.zoomChange({ pageId: (page as Page).id, zoomFactor })
        );
      })
    );
  });

  zoomChange$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TransformEffectsActions.zoomChange),
      concatLatestFrom(() => [
        this.store.select(selectCurrentPage),
        this.store.select(selectPageViewport),
        this.store.select(selectPageAlignmentInViewport),
        this.store.select(selectScreenPixelDensity),
      ]),
      filter(([, currentPage, viewport]) => {
        return currentPage !== null && viewport !== null;
      }),
      switchMap(([, currentPage, viewport, alignment, spd]) => {
        const page = currentPage as Page;
        const viewportSize = getRectSize(viewport as Rect);
        return of(
          TransformEffectsActions.pageWindowChange({
            newWindow: this.calcPageWindow(viewportSize, page, alignment, spd),
            pageId: page.id,
            pageSize: page.size,
          })
        );
      })
    );
  });

  currentPageChange$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        PagesEffectsActions.openSuccess,
        SketchbookEffectsActions.newPageReady,
        PagesEffectsActions.newPageReady,
        SketchbookEffectsActions.currentPageChange,
        PagesEffectsActions.currentPageChange
      ),
      concatLatestFrom(() => [
        this.store.select(selectPageViewport),
        this.store.select(selectCurrentPage),
        this.store.select(selectPageAlignmentInViewport),
        this.store.select(selectScreenPixelDensity),
      ]),
      filter(([, pageViewport, currentPage]) => {
        return currentPage !== null && pageViewport !== null;
      }),
      switchMap(([, pageViewport, currentPage, alignment, spd]) => {
        const page = currentPage as Page;
        const viewport = pageViewport as Rect;
        return of(
          TransformEffectsActions.pageWindowChange({
            pageId: page.id,
            pageSize: page.size,
            newWindow: this.calcPageWindow(
              { width: viewport.width, height: viewport.height } as Size,
              page,
              alignment,
              spd
            ),
          })
        );
      })
    );
  });

  pageWindowChange$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        TransformEffectsActions.pageWindowChange,
        PageViewportComponentActions.scrolling,
        PageViewportComponentActions.scrollChange
      ),
      concatLatestFrom(() => [this.store.select(selectPageViewport)]),
      filter(([, pageViewport]) => pageViewport !== null),
      switchMap(([{ newWindow }, pageViewport]) => {
        const viewport = pageViewport as Rect;
        return of(
          TransformEffectsActions.transformChange({
            transform: {
              scaleFactor: viewport.width / newWindow.width,
              transX: -newWindow.x,
              transY: -newWindow.y,
            },
          })
        );
      })
    );
  });

  constructor(private actions$: Actions, private store: Store) {}

  private calcPageWindow(
    viewportSize: Size,
    page: Page,
    alignment: Alignment,
    spd: number
  ): Rect {
    // Calc width and height of new page window
    const width = (viewportSize.width * 25.4) / (spd * page.zoomFactor);
    const height = (viewportSize.height * width) / viewportSize.width;

    // Set x and y of top left corner of view window. If available
    // use centre of current page window to locate the top left
    // corner. Use this with width and height to create new page
    // window Rect object
    let x = 0;
    let y = 0;
    if (page.windowCentre) {
      x = page.windowCentre.x - width / 2;
      y = page.windowCentre.y - height / 2;
    }
    const newWindow: Rect = { x, y, width, height };

    // Check for horizontal alignment adjustment. This can occur when the page
    // width fits within the width of the page window
    if (greaterThan(newWindow.width, page.size.width)) {
      newWindow.x = this.alignHorizontally(newWindow, page.size, alignment);
    } else {
      const maxX = page.size.width - newWindow.width;
      if (newWindow.x < 0) {
        newWindow.x = 0;
      } else if (newWindow.x > maxX) {
        newWindow.x = maxX;
      }
    }

    // Check for vertical alignment adjustment. This can occur when the page
    // height fits within the height of the page window
    if (greaterThan(newWindow.height, page.size.height)) {
      newWindow.y = this.alignVertically(newWindow, page.size, alignment);
    } else {
      const maxY = page.size.height - newWindow.height;
      if (newWindow.y < 0) {
        newWindow.y = 0;
      } else if (newWindow.y > maxY) {
        newWindow.y = maxY;
      }
    }
    return newWindow;
  }

  /**
   *
   * @param newWindow - initial placement of new page window
   * @param pageSize  - width & height of current page
   * @param alignment - alignment setting
   * @returns - x coord of page window top left corner
   */
  private alignHorizontally(newWindow: Rect, pageSize: Size, alignment: Alignment): number {
    let x = 0;
    if (lessThan(pageSize.width, newWindow.width)) {
      switch (alignment.horizontal) {
        case 'center': {
          x -= (newWindow.width - pageSize.width) / 2;
          break;
        }

        case 'right': {
          x -= newWindow.width - pageSize.width;
          break;
        }
      }
    }
    return x;
  }

  /**
   * @param newWindow - initial placement of new page window
   * @param pageSize  - width & height of current page
   * @param alignment - alignment setting
   * @returns - y coord of page window top left corner
   *
   */
  private alignVertically(newWindow: Rect, pageSize: Size, alignment: Alignment): number {
    let y = 0;
    if (lessThan(pageSize.height, newWindow.height)) {
      switch (alignment.vertical) {
        case 'center': {
          y -= (newWindow.height - pageSize.height) / 2;
          break;
        }

        case 'bottom': {
          y -= newWindow.height - pageSize.height;
          break;
        }
      }
    }
    return y;
  }

  private calcFittedZoom(
    selectedZoom: ZoomSelectType,
    viewport: Size,
    pageSize: Size,
    spd: number
  ): number {
    let zoomFactor = this.calcZoomFitWidth(viewport, pageSize, spd);
    if (selectedZoom === 'fit-to-window') {
      const windowHeight = (viewport.height * pageSize.width) / viewport.width;
      if (greaterThan(pageSize.height, windowHeight)) {
        zoomFactor = this.calcZoomFitHeight(viewport, pageSize, spd);
      }
    }
    return zoomFactor;
  }

  private calcZoomFitWidth(viewport: Size, pageSize: Size, spd: number): number {
    const zoomFactor = (viewport.width * 25.4) / (pageSize.width * spd);
    return zoomFactor;
  }

  private calcZoomFitHeight(viewport: Size, pageSize: Size, spd: number): number {
    const zoomFactor = (viewport.height * 25.4) / (pageSize.height * spd);
    return zoomFactor;
  }
}
