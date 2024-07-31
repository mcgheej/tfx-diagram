import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
  inject,
  input,
  output,
} from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TfxIconButtonModule } from '@tfx-diagram/shared-angular/ui/tfx-icon-button';
import { ContextMenuService } from '@tfx-diagram/shared-angular/ui/tfx-menu';
import { TfxResizeObserverModule } from '@tfx-diagram/shared-angular/ui/tfx-resize-observer';
import { TfxResizeEvent } from '@tfx-diagram/shared-angular/utils/shared-types';
import { PageTabsOverflowButtonComponent } from '../components/page-tabs-overflow-button.ts/page-tabs-overflow-button.component';
import { PageTabsViewerComponent } from '../components/page-tabs-viewer/page-tabs-viewer.component';
import { PageTabsViewerService } from '../components/page-tabs-viewer/page-tabs-viewer.service';
import { MoveResult, PageRenameDetails, PageTabClickData } from '../page-selector.types';
import { PageSelectMenuService } from './page-select-menu.service';

@Component({
  selector: 'tfx-page-selector',
  standalone: true,
  imports: [
    CommonModule,
    MatTooltipModule,
    TfxIconButtonModule,
    TfxResizeObserverModule,
    PageTabsOverflowButtonComponent,
    PageTabsViewerComponent,
  ],
  templateUrl: './page-selector.component.html',
  styleUrl: './page-selector.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [PageSelectMenuService, PageTabsViewerService],
})
export class PageSelectorComponent {
  // inputs
  pages = input.required<string[]>();
  selectedPageIndex = input.required<number>();

  // outputs
  pageSelectedChange = output<number>();
  pageAddClick = output<void>();
  pageDeleteClick = output<number>();
  pageNameChange = output<PageRenameDetails>();
  pageOrderChange = output<MoveResult>();

  @ViewChild('pageSelector') pageSelectorElRef: ElementRef | null = null;

  // Injected services
  viewerService = inject(PageTabsViewerService);
  private pageSelectMenu = inject(PageSelectMenuService);
  private contextMenu = inject(ContextMenuService);

  public tabsViewerMaxWidth = 300;

  onPageListClick() {
    if (this.pageSelectorElRef) {
      this.contextMenu
        .openContextMenu(
          this.pageSelectMenu.getContextMenu(this.pages(), this.selectedPageIndex()),
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
        )
        .afterClosed()
        .subscribe((item) => {
          let i = 0;
          for (const page of this.pages()) {
            if (page === item.label) {
              this.pageSelectedChange.emit(i);
              return;
            }
            i++;
          }
        });
    }
  }

  onPageAddClick() {
    this.pageAddClick.emit();
  }

  onPageTabSelect(clickData: PageTabClickData) {
    if (clickData.pageIndex !== this.selectedPageIndex()) {
      this.pageSelectedChange.emit(clickData.pageIndex);
    }
  }

  onPageNameChange(renameDetails: PageRenameDetails) {
    this.pageNameChange.emit(renameDetails);
  }

  onPageDeleteClick(pageIndex: number) {
    this.pageDeleteClick.emit(pageIndex);
  }

  onScrollRight() {
    this.viewerService.scrollRightClick();
  }

  onScrollLeft() {
    this.viewerService.scrollLeftClick();
  }

  /**
   *
   * This function is called when the size of the Page Selector
   * control changes. This may because the user resizes the window
   * or some additional controls are added/removed to/from the
   * Page Control Bar.
   *
   * The maximum allowed width for the Tabs Viewer section of the
   * Page Selector is calculated by subtracting 150px from the
   * width of the Page Selector (the 150px allows for the Page List
   * Button, the Scroll Buttons and the Add Page Button, plus a little
   * bit of padding space).
   *
   * If the maximum width calculated is different from the value
   * held in the tabsViewerMaxWidth property then the property
   * value is updated and a 'viewer.maxWidthChange' event is sent to
   * the Page Selector state machine.
   */
  onPageSelectorResize(resizeData: TfxResizeEvent) {
    // const tabsViewerMaxWidth = resizeData.newRect.width - 150;
    const tabsViewerMaxWidth = 160;
    if (this.tabsViewerMaxWidth !== tabsViewerMaxWidth) {
      this.tabsViewerMaxWidth = tabsViewerMaxWidth;
    }
  }
}
