import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
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
import { MoveResult, PageRenameDetails } from '@tfx-diagram/diagram/ui/page-selector';
import { ZoomControlService, ZoomSelectType } from '@tfx-diagram/diagram/ui/zoom-control';
import { MouseWheelService } from '@tfx-diagram/diagram/util/mouse-wheel';
import { INITIAL_ZOOM_FACTOR, Page } from '@tfx-diagram/electron-renderer-web/shared-types';
import {
  combineLatest,
  filter,
  map,
  Observable,
  Subject,
  takeUntil,
  withLatestFrom,
} from 'rxjs';

@Component({
  selector: 'tfx-sketchbook-view',
  templateUrl: './sketchbook-view.component.html',
  styleUrls: ['./sketchbook-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SketchbookViewComponent implements OnInit, OnDestroy {
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
        { coords: mousePosition, format },
        page,
        pageData,
        showShapeInspector,
      ]) => {
        return {
          showRulers,
          showMousePosition,
          mousePosition,
          format,
          showControls: status === 'modified' || status === 'saved',
          zoomFactor: page ? page.zoomFactor : INITIAL_ZOOM_FACTOR,
          pageData,
          pageNames: pageData.pages.map((page) => page.title),
          showShapeInspector,
        };
      }
    )
  );

  private zoomFromWheel$: Observable<'zoomIn' | 'zoomOut'> = this.mouseWheel.events$.pipe(
    withLatestFrom(this.viewVM$.pipe(map((vm) => vm.showControls))),
    filter(([ev, showControls]) => showControls && (ev === 'zoomIn' || ev === 'zoomOut')),
    map(([event]) => event as 'zoomIn' | 'zoomOut')
  );

  private destroy$ = new Subject<void>();

  constructor(
    private store: Store,
    private dialog: MatDialog,
    private mouseWheel: MouseWheelService,
    private zoomService: ZoomControlService
  ) {}

  ngOnInit(): void {
    this.zoomFromWheel$.pipe(takeUntil(this.destroy$)).subscribe((ev) => {
      if (ev === 'zoomIn') {
        this.store.dispatch(
          SketchbookViewComponentActions.zoomChange({
            zoomSelected: this.zoomService.getIncreasedZoom(),
          })
        );
      } else if (ev === 'zoomOut') {
        this.store.dispatch(
          SketchbookViewComponentActions.zoomChange({
            zoomSelected: this.zoomService.getDecreasedZoom(),
          })
        );
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onZoomChanged(zoomSelected: ZoomSelectType) {
    this.store.dispatch(SketchbookViewComponentActions.zoomChange({ zoomSelected }));
  }

  onPageAdd() {
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

  onPageDelete(pageIndex: number, pages: Page[]) {
    this.store.dispatch(
      SketchbookViewComponentActions.deletePageClick({
        pageIndex,
        page: { ...pages[pageIndex] },
      })
    );
  }

  onPageRename(renameDetails: PageRenameDetails, pages: Page[]) {
    if (renameDetails.pageIndex >= 0 && renameDetails.pageIndex < pages.length) {
      this.store.dispatch(
        SketchbookViewComponentActions.pageTitleChange({
          pageId: pages[renameDetails.pageIndex].id,
          newTitle: renameDetails.newTitle,
        })
      );
    }
  }

  onPageChange(newCurrentPageIndex: number) {
    this.store.dispatch(
      SketchbookViewComponentActions.currentPageChange({ newCurrentPageIndex })
    );
  }

  onPageMove(move: MoveResult) {
    this.store.dispatch(SketchbookViewComponentActions.pageOrderChange({ move }));
  }
}
