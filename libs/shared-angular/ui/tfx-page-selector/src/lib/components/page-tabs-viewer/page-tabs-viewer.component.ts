import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnChanges,
  OnDestroy,
  OnInit,
  QueryList,
  SimpleChanges,
  ViewChildren,
  inject,
  input,
  output,
} from '@angular/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { Subject, takeUntil } from 'rxjs';
import { MoveResult, PageRenameDetails, PageTabClickData } from '../../page-selector.types';
import { PageTabComponent } from '../page-tab/page-tab.component';
import { DragTabService } from './services/drag-tab.service';
import { mouseLeftDownOnTab } from './services/mouse-observables';
import { PageTabsViewerService } from './services/page-tabs-viewer.service';

@Component({
  selector: 'tfx-page-tabs-viewer',
  standalone: true,
  imports: [CommonModule, MatSnackBarModule, PageTabComponent],
  templateUrl: './page-tabs-viewer.component.html',
  styleUrl: './page-tabs-viewer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageTabsViewerComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {
  // inputs
  maxWidth = input(300);
  pages = input<string[]>([]);
  selectedPageIndex = input(-1);

  // outputs
  pageTabSelect = output<PageTabClickData>();
  pageRename = output<PageRenameDetails>();
  pageDelete = output<number>();
  pageMove = output<MoveResult>();

  // QueryList containing the tab elements in the hidden tab group
  // that contains a tab for each pages
  @ViewChildren('tab', { read: ElementRef })
  pageTabRefs!: QueryList<ElementRef> | null;

  // Injected services
  viewerService = inject(PageTabsViewerService);
  dragTabService = inject(DragTabService);

  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.dragTabService.pageMove$
      .pipe(takeUntil(this.destroy$))
      .subscribe((moveResult) => this.pageMove.emit(moveResult));
  }

  /**
   * If the maxWidth of the tabs viewer changes then need to recalculate the
   * viewer data
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['maxWidth']) {
      this.viewerService.maxWidthChanged(this.maxWidth());
    }
  }

  /**
   * Subscribe to changes to the pageTabRefs QueryList. If these change
   * then need to recalculate the viewer data. Note the setTimeout() call.
   * This is required to get accurate position data from the tab refs (without
   * the setTimeout() the offsetLeft values are inaccurate)
   */
  ngAfterViewInit(): void {
    if (this.pageTabRefs) {
      this.viewerService.tabRefsChanged(this.pageTabRefs);
      this.pageTabRefs.changes.subscribe((values) => {
        setTimeout(() => {
          if (values) {
            this.viewerService.tabRefsChanged(values as QueryList<ElementRef>);
          } else {
            this.viewerService.tabRefsChanged(null);
          }
        });
      });
    }
  }

  // Drive unsubscribe from observables
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Handles mouse button down on a page tab. If the button
  // depressed was the left button then also call the
  // mouseLeftDownOnTab function to trigger a potential
  // page tab drag/move operation
  public onPageTabSelect(clickData: PageTabClickData) {
    this.pageTabSelect.emit(clickData);
    if (clickData.button === 'left') {
      mouseLeftDownOnTab(clickData);
    }
  }

  public onPageRename(renameDetails: PageRenameDetails) {
    if (this.viewerService.pageNameAvailable(renameDetails, this.pages())) {
      this.pageRename.emit(renameDetails);
    }
  }

  public onPageDelete(pageIndex: number) {
    if (this.pages().length > 1) {
      this.pageDelete.emit(pageIndex);
    }
  }
}
