import { Injectable, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Shape } from '@tfx-diagram/diagram-data-access-shape-base-class';
import { PageViewportComponentActions } from '@tfx-diagram/diagram-data-access-store-actions';
import { selectCurrentPage } from '@tfx-diagram/diagram-data-access-store-features-pages';
import { selectPageWindow } from '@tfx-diagram/diagram-data-access-store-features-transform';
import {
  selectControlShapes,
  selectHighlightedShapeId,
  selectTextEdit,
} from '@tfx-diagram/diagram/data-access/store/features/control-frame';
import { selectShapes } from '@tfx-diagram/diagram/data-access/store/features/shapes';
import { PRECISION } from '@tfx-diagram/diagram/util/misc-functions';
import { MouseWheelService } from '@tfx-diagram/diagram/util/mouse-wheel';
import { EDIT_TEXT_ID, Size } from '@tfx-diagram/electron-renderer-web/shared-types';
import { Rect } from '@tfx-diagram/shared-angular/utils/shared-types';
import { combineLatest, filter, map, Subject, takeUntil, withLatestFrom } from 'rxjs';

@Injectable()
export class PageViewportComponentService implements OnDestroy {
  vm$ = combineLatest([
    this.store.select(selectPageWindow),
    this.store.select(selectTextEdit),
  ]).pipe(
    withLatestFrom(this.store.select(selectCurrentPage)),
    map(([[pageWindow, textEdit], page]) => {
      if (page && pageWindow) {
        return {
          window: pageWindow,
          page,
          showVerticalScrollbar: page.size.height - pageWindow.height > PRECISION,
          showHorizontalScrollbar: page.size.width - pageWindow.width > PRECISION,
          textEdit,
        };
      }
      return null;
    })
  );

  cursorType$ = this.store.select(selectHighlightedShapeId).pipe(
    withLatestFrom(this.store.select(selectShapes), this.store.select(selectControlShapes)),
    map(([highlightedShapeId, shapes, controlShapes]) => {
      if (highlightedShapeId === EDIT_TEXT_ID) {
        return 'text';
      }
      let shape: Shape | undefined = shapes.get(highlightedShapeId);
      if (shape) {
        return shape.cursor;
      }
      shape = controlShapes.get(highlightedShapeId);
      if (shape) {
        return shape.cursor;
      }
      return 'default';
    })
  );

  private destroy$ = new Subject<void>();

  private scrollFromWheel$ = this.mouseWheel.events$.pipe(
    filter((ev) => ev !== 'zoomIn' && ev !== 'zoomOut'),
    withLatestFrom(this.vm$),
    takeUntil(this.destroy$)
  );

  constructor(private store: Store, private mouseWheel: MouseWheelService) {}

  start(): void {
    this.scrollFromWheel$.subscribe(([ev, vm]) => {
      if (vm) {
        const { page, window } = vm;
        if (ev === 'scrollDown' && vm.showVerticalScrollbar) {
          let newY = window.y + 10;
          if (newY > page.size.height - window.height) {
            newY = page.size.height - window.height;
          }
          this.updateScrolling(page.id, { ...window, y: newY });
        } else if (ev === 'scrollUp' && vm.showVerticalScrollbar) {
          let newY = window.y - 10;
          if (newY < 0) {
            newY = 0;
          }
          this.updateScrolling(page.id, { ...window, y: newY });
        } else if (ev === 'scrollLeft' && vm.showHorizontalScrollbar) {
          let newX = window.x - 10;
          if (newX > page.size.width - window.width) {
            newX = page.size.width - window.width;
          }
          this.updateScrolling(page.id, { ...window, x: newX });
        } else if (ev === 'scrollRight' && vm.showHorizontalScrollbar) {
          let newX = window.x + 10;
          if (newX < 0) {
            newX = 0;
          }
          this.updateScrolling(page.id, { ...window, x: newX });
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  viewportSizeChange(newSize: Size | null) {
    this.store.dispatch(PageViewportComponentActions.viewportSizeChange({ newSize }));
  }

  updateScrolling(pageId: string, newWindow: Rect) {
    this.store.dispatch(
      PageViewportComponentActions.scrolling({
        pageId,
        newWindow,
      })
    );
  }

  scrollChange(pageId: string, newWindow: Rect) {
    this.store.dispatch(
      PageViewportComponentActions.scrollChange({
        pageId,
        newWindow,
      })
    );
  }
}
