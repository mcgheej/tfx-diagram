import { Injectable, OnDestroy, inject } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { SketchbookViewComponentActions } from '@tfx-diagram/diagram-data-access-store-actions';
import {
  selectCurrentPage,
  selectPageData,
} from '@tfx-diagram/diagram-data-access-store-features-pages';
import {
  selectShowMousePosition,
  selectShowRulers,
  selectShowShapeInspector,
} from '@tfx-diagram/diagram-data-access-store-features-settings';
import { selectStatus } from '@tfx-diagram/diagram-data-access-store-features-sketchbook';
import { selectMousePositionAndFormat } from '@tfx-diagram/diagram-data-access-store-selectors-select-mouse-and-position-format';
import { NewDialogComponent, NewDialogResult } from '@tfx-diagram/diagram/ui/dialogs';
import { ZoomControlService, ZoomSelectType } from '@tfx-diagram/diagram/ui/zoom-control';
import { MouseWheelService } from '@tfx-diagram/diagram/util/mouse-wheel';
import { INITIAL_ZOOM_FACTOR, Page } from '@tfx-diagram/electron-renderer-web/shared-types';
import { MoveResult, PageRenameDetails } from '@tfx-diagram/shared-angular/tfx-page-selector';
import { Observable, Subscription, combineLatest, filter, map, withLatestFrom } from 'rxjs';

@Injectable()
export class SketchbookViewService implements OnDestroy {
  // Injected services
  private store = inject(Store);
  private dialog = inject(MatDialog);
  private mouseWheel = inject(MouseWheelService);
  private zoomService = inject(ZoomControlService);

  viewVM$ = combineLatest([
    this.store.select(selectStatus),
    this.store.select(selectShowRulers),
    this.store.select(selectShowMousePosition),
    this.store.select(selectMousePositionAndFormat),
    this.store.select(selectCurrentPage),
    this.store.select(selectPageData),
    this.store.select(selectShowShapeInspector),
  ]).pipe(
    map(
      ([
        status,
        showRulers,
        showMousePosition,
        { coords: mousePosition, format, units },
        page,
        pageData,
        showShapeInspector,
      ]) => {
        return {
          showRulers,
          showMousePosition,
          mousePosition,
          format,
          units,
          showControls: status === 'modified' || status === 'saved',
          zoomFactor: page ? page.zoomFactor : INITIAL_ZOOM_FACTOR,
          pageData,
          pageNames: this.getPageNames(pageData),
          showShapeInspector,
        };
      }
    )
  );

  zoomFromWheel$: Observable<ZoomSelectType> = this.mouseWheel.events$.pipe(
    withLatestFrom(this.viewVM$.pipe(map((vm) => vm.showControls))),
    filter(([ev, showControls]) => showControls && (ev === 'zoomIn' || ev === 'zoomOut')),
    map(([event]) => {
      if (event === 'zoomIn') {
        return this.zoomService.getIncreasedZoom();
      }
      return this.zoomService.getDecreasedZoom();
    })
  );

  private pageNames: string[] = [];

  private zoomFromWheelSubscription: Subscription;

  constructor() {
    this.zoomFromWheelSubscription = this.zoomFromWheel$.subscribe((zoomSelected) =>
      this.store.dispatch(SketchbookViewComponentActions.zoomChange({ zoomSelected }))
    );
  }

  ngOnDestroy(): void {
    this.zoomFromWheelSubscription.unsubscribe();
  }

  zoomChange(zoomSelected: ZoomSelectType) {
    this.store.dispatch(SketchbookViewComponentActions.zoomChange({ zoomSelected }));
  }

  addPage() {
    this.store.dispatch(SketchbookViewComponentActions.addPageClick());
    const dialogRef: MatDialogRef<NewDialogComponent, NewDialogResult> = this.dialog.open(
      NewDialogComponent,
      {
        autoFocus: true,
        height: '370px',
        data: {
          dialogType: 'Page',
        },
      }
    );
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.store.dispatch(
          SketchbookViewComponentActions.addPageConfirmed({
            size: { width: result.width, height: result.height },
            format: result.pageFormat,
            layout: result.layout,
          })
        );
      } else {
        this.store.dispatch(SketchbookViewComponentActions.addPageCancel());
      }
    });
  }

  deletePage(pageIndex: number, pages: Page[]) {
    this.store.dispatch(
      SketchbookViewComponentActions.deletePageClick({
        pageIndex,
        page: { ...pages[pageIndex] },
      })
    );
  }

  renamePage(renameDetails: PageRenameDetails, pages: Page[]) {
    if (renameDetails.pageIndex >= 0 && renameDetails.pageIndex < pages.length) {
      this.store.dispatch(
        SketchbookViewComponentActions.pageTitleChange({
          pageId: pages[renameDetails.pageIndex].id,
          newTitle: renameDetails.newTitle,
        })
      );
    }
  }

  changePage(newCurrentPageIndex: number) {
    this.store.dispatch(
      SketchbookViewComponentActions.currentPageChange({ newCurrentPageIndex })
    );
  }
  movePage(move: MoveResult) {
    this.store.dispatch(SketchbookViewComponentActions.pageOrderChange({ move }));
  }

  private getPageNames(pageData: { pages: Page[]; currentIdx: number }): string[] {
    if (pageData.pages.length !== this.pageNames.length) {
      this.pageNames = pageData.pages.map((page) => page.title);
    } else {
      for (let i = 0; i < this.pageNames.length; i++) {
        if (this.pageNames[i] !== pageData.pages[i].title) {
          this.pageNames = pageData.pages.map((page) => page.title);
          break;
        }
      }
    }
    return this.pageNames;
  }
}
