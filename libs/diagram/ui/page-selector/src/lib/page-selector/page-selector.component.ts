import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { ContextMenuService, PopupMenuRef } from '@tfx-diagram/shared-angular/ui/tfx-menu';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PageSelectorMachineService } from '../+xstate/page-selector-machine.service';
import { MoveResult, PageRenameDetails, ScrollData } from '../page-selector.types';
import { PageListSelectMenuService } from './page-list-select-menu.service';

export const MOVE_CURSOR_CLASS = 'tfx-indicator-move-cursor';

@Component({
  selector: 'tfx-page-selector',
  templateUrl: './page-selector.component.html',
  styleUrls: ['./page-selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [PageSelectorMachineService, PageListSelectMenuService],
})
export class PageSelectorComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {
  @Input() pages: string[] = [];
  @Input() selectedPageIndex = -1;
  @Output() selectedPageIndexChanged = new EventEmitter<number>();
  @Output() pageAdd = new EventEmitter<void>();
  @Output() pageDelete = new EventEmitter<number>();
  @Output() pageRename = new EventEmitter<PageRenameDetails>();
  @Output() pageMove = new EventEmitter<MoveResult>();

  @ViewChild('pageSelector') pageSelectorElRef: ElementRef | null = null;

  public tabsViewerMaxWidth = 300;
  public scrollData: ScrollData = {
    leftDisabled: false,
    rightDisabled: false,
    scrollIndex: 0,
  };

  private pageListMenuRef: PopupMenuRef | null = null;

  private destroy$ = new Subject<void>();
  private ro: ResizeObserver | null = null;

  constructor(
    public stateMachine: PageSelectorMachineService,
    private contextMenu: ContextMenuService,
    private pageSelectMenu: PageListSelectMenuService,
    private changeDetectRef: ChangeDetectorRef,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    // this.tabsViewerMaxWidth = this.maxWidth - 180;

    // Need to subscribe here rather than async pipe in template to
    // avoid weird side effect on edge of overflow. Bit hacky but it
    // works

    // Toggle cursor style class based on whether or not currntly
    // in "tracking" state
    this.stateMachine.trackingState$
      .pipe(takeUntil(this.destroy$))
      .subscribe((trackingState) => {
        if (trackingState) {
          this.renderer.addClass(document.body, MOVE_CURSOR_CLASS);
        } else {
          this.renderer.removeClass(document.body, MOVE_CURSOR_CLASS);
        }
      });

    this.stateMachine.scrollData$.pipe(takeUntil(this.destroy$)).subscribe((scrollData) => {
      this.scrollData = scrollData;
      this.changeDetectRef.detectChanges();
    });

    this.stateMachine.moveResult$.pipe(takeUntil(this.destroy$)).subscribe((moveResult) => {
      this.pageMove.emit(moveResult);
      this.stateMachine.moveDone();
    });
    this.stateMachine.start();
  }

  ngAfterViewInit() {
    if (this.ro) {
      this.ro.disconnect();
    }
    if (this.pageSelectorElRef) {
      this.ro = new ResizeObserver(() => {
        this.tabsViewerMaxWidth = this.pageSelectorElRef?.nativeElement.clientWidth - 150;
        this.changeDetectRef.detectChanges();
      });
      this.ro.observe(this.pageSelectorElRef.nativeElement);
    } else {
      console.log(`pageSelector element ref is null`);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.doOnChanges(changes)) {
      this.changeDetectRef.detectChanges();
    }
  }

  ngOnDestroy() {
    if (this.destroy$) {
      this.destroy$.next();
      this.destroy$.complete();
    }
    if (this.ro) {
      this.ro.disconnect();
    }
  }

  // --------------------------------------------------------------------------

  onPageList() {
    if (this.pageSelectorElRef) {
      this.pageListMenuRef = this.contextMenu.openContextMenu(
        this.pageSelectMenu.getContextMenu(this.pages, this.selectedPageIndex),
        {
          associatedElement: this.pageSelectorElRef,
          positions: [
            {
              originX: 'start',
              originY: 'top',
              overlayX: 'start',
              overlayY: 'bottom',
            },
          ],
        }
      );
      this.pageListMenuRef.afterClosed().subscribe((item) => {
        let i = 0;
        for (const page of this.pages) {
          if (page === item.label) {
            this.selectedPageIndexChanged.emit(i);
            break;
          }
          i++;
        }
      });
    }
  }

  onAddPageClick() {
    this.pageAdd.emit();
  }

  onPageTabSelect(pageIndex: number) {
    if (pageIndex !== this.selectedPageIndex) {
      this.selectedPageIndexChanged.emit(pageIndex);
    }
  }

  onPageRename(renameDetails: PageRenameDetails) {
    this.pageRename.emit(renameDetails);
  }

  onPageDelete(pageIndex: number) {
    this.pageDelete.emit(pageIndex);
  }

  onScrollLeft() {
    this.stateMachine.sendTabViewerScroll(-1);
  }

  onScrollRight() {
    this.stateMachine.sendTabViewerScroll(1);
  }

  // ---------------------------------------------------------------------------

  private doOnChanges(changes: SimpleChanges): boolean {
    let changeDetectRequired = false;
    let pagesChanged = false;
    let selectedPageChanged = false;
    for (const propName in changes) {
      if (Object.prototype.hasOwnProperty.call(changes, propName)) {
        switch (propName) {
          // case 'maxWidth': {
          //   changeDetectRequired = this.maxWidthChange(
          //     changes,
          //     changeDetectRequired
          //   );
          //   break;
          // }
          case 'pages': {
            changeDetectRequired = true;
            pagesChanged = true;
            break;
          }
          case 'selectedPageIndex': {
            changeDetectRequired = true;
            selectedPageChanged = true;
            break;
          }
        }
      }
    }
    if (pagesChanged) {
      this.stateMachine.pagesChanged(this.pages);
    }
    if (selectedPageChanged) {
      this.stateMachine.selectedPageChanged(this.selectedPageIndex);
    }
    return changeDetectRequired;
  }

  // private maxWidthChange(
  //   changes: SimpleChanges,
  //   changeDetectRequired: boolean
  // ): boolean {
  //   if (
  //     !changes.maxWidth.firstChange &&
  //     changes.maxWidth.currentValue !== changes.maxWidth.previousValue
  //   ) {
  //     this.tabsViewerMaxWidth = this.maxWidth - 180;
  //     changeDetectRequired = true;
  //   }
  //   return changeDetectRequired;
  // }
}
