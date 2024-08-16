import { ElementRef, Injectable, QueryList, inject, signal } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  PageRenameDetails,
  PageTab,
  PageTabsViewerVM,
  TabVisibilityStatus,
  ViewerAlignment,
} from '../../../page-selector.types';

/**
 * Initially the Page Tab Viewer will display a single
 * page tab, aligned to the left, not scrolled and not
 * overflowed.
 */
const initialPageTabsViewerVM: PageTabsViewerVM = {
  align: 'left',
  firstVisibleIdx: 0,
  lastVisibleIdx: 0,
  scrolled: false,
  overflowed: false,
};

@Injectable()
export class PageTabsViewerService {
  // injected services
  private snackBar = inject(MatSnackBar);

  pageTabsViewerVM = signal<PageTabsViewerVM>(initialPageTabsViewerVM);

  //
  pageTabs: PageTab[] = [];
  maxWidth = 300;
  private align: ViewerAlignment = 'left';
  private tabRefs: QueryList<ElementRef> | null = null;
  private totalWidth = 0;
  private firstVisibleIdx = 0;
  private lastVisibleIdx = 0;

  /**
   * The PageTabViewer component calls this method whenever its maxWidth
   * input changes. The method sets a local property to the max width value
   * and then calls the setPageTabs private method to update pageTabs and
   * pageTabsViewerVM properties
   */
  maxWidthChanged(maxWidth: number) {
    this.maxWidth = maxWidth;
    this.setPageTabs();
  }

  /**
   * The PageTabViewer component calls this method when it reacts to any
   * changes to the PageTab components displayed in the PageTabViewer
   * component. The method sets a local property to the tabRefs QueryList
   * passed as an argument to the method. The private method setPageTabs is
   * then called to update pageTabs and pageTabsViewerVM properties.
   */
  tabRefsChanged(tabRefs: QueryList<ElementRef> | null) {
    this.tabRefs = tabRefs;
    if (this.tabRefs) {
      this.setPageTabs();
    }
  }

  scrollLeftClick() {
    this.scrollLeft();
  }

  scrollLeft() {
    if (this.pageTabs.length < 2) {
      this.align = 'right';
    } else if (this.align === 'right') {
      // If already aligned right then simply need to increase
      // endIdx by 1 unless already at end

      if (this.lastVisibleIdx < this.pageTabs.length - 1) {
        this.lastVisibleIdx++;
      }
    } else {
      this.align = 'right';
      if (
        this.pageTabs[this.lastVisibleIdx].visibilityStatus === 'visible' &&
        this.lastVisibleIdx < this.pageTabs.length - 1
      ) {
        this.lastVisibleIdx++;
      }
    }
    this.setPageTabs();
  }

  scrollRightClick() {
    this.scrollRight();
  }

  scrollRight() {
    if (this.pageTabs.length < 2) {
      this.align = 'left';
    } else if (this.align === 'left') {
      // If already aligned left then simply decrease by 1
      if (this.firstVisibleIdx > 0) {
        this.firstVisibleIdx--;
      }
    } else {
      this.align = 'left';
      if (
        this.pageTabs[this.firstVisibleIdx].visibilityStatus === 'visible' &&
        this.firstVisibleIdx > 0
      ) {
        this.firstVisibleIdx--;
      }
    }
    this.setPageTabs();
  }

  pageNameAvailable(renameDetails: PageRenameDetails, pages: string[]) {
    let i = 0;
    for (const page of pages) {
      if (page === renameDetails.newTitle) {
        if (i !== renameDetails.pageIndex) {
          this.snackBar.open('Name already in use!', undefined, {
            duration: 2000,
          });
        }
        return false;
      }
      i++;
    }
    return true;
  }

  private setPageTabs() {
    const tabs: PageTab[] = [];

    // Add basic info from page tab native elements
    if (this.tabRefs && this.tabRefs.length > 0) {
      this.tabRefs.forEach((t) => {
        tabs.push({
          refX: t.nativeElement.offsetLeft,
          refY: t.nativeElement.offsetTop,
          width: t.nativeElement.offsetWidth,
          left: 0,
          visibilityStatus: 'hidden',
        });
      });

      // Adjust width to cater for right margin on all page tabs bar the
      // last tab (it shouldn't have any right margin). Also calculate
      // the total width of the page tabs
      this.totalWidth = 0;
      for (let i = 0; i < tabs.length - 1; i++) {
        tabs[i].width = tabs[i + 1].refX - tabs[i].refX;
        this.totalWidth += tabs[i].width;
      }
      this.totalWidth += tabs[tabs.length - 1].width;

      if (this.totalWidth <= this.maxWidth) {
        // All the page tabs fit in the max width so set up with page
        // tabs aligned to the left of the viewer and set up the index
        // values for the first and last visible page tabs
        this.align = 'left';
        this.firstVisibleIdx = 0;
        this.lastVisibleIdx = tabs.length - 1;

        // Finally set up the display left and visibility attrivutes for
        // each tab
        tabs.forEach((t) => {
          t.left = t.refX;
          t.visibilityStatus = 'visible';
        });
      } else {
        // The total width of the page tabs is wider than the maximum
        // available width so they will be truncated. How this happens
        // depends on the current alignment.

        // First check if a new page has been added ("tabs" length greater
        // than the "pageTabs" property length)
        if (tabs.length > this.pageTabs.length) {
          this.align = 'right';
          this.lastVisibleIdx = tabs.length - 1;
        }
        if (this.align === 'left') {
          // The page tabs are currently aligned to the left side of the
          // viewer and the first tab visible is given by the index value
          // in "firstVisibleIdx". Need to calculate the index of the last
          // visible or partially visible tab index based on the current
          // "maxWidth" value and tab widths.
          let w = 0;
          for (let i = this.firstVisibleIdx; i < tabs.length; i++) {
            w += tabs[i].width;
            if (w >= this.maxWidth) {
              this.lastVisibleIdx = i;
              break;
            }
          }

          // Now calculate the display left edge and visibility status for
          // each tab.
          const baseX = tabs[0].refX;
          const offset = tabs[this.firstVisibleIdx].refX - baseX;
          tabs.forEach((t) => {
            t.left = t.refX - offset;
            t.visibilityStatus = this.visibilityStatus(t, baseX, this.maxWidth);
          });
        } else {
          // The page tabs are currently aligned to the right side of the
          // viewer. The last tab visible is given by the index value
          // in "lastVisibleIdx". This may need modification if a tab was
          // deleted.
          if (this.lastVisibleIdx >= tabs.length) {
            this.lastVisibleIdx = tabs.length - 1;
          }
          // Need to calculate the index of the first
          // visible or partially visible  tab index base on the current
          // "maxWidth" value and tab widths
          let w = 0;
          for (let i = this.lastVisibleIdx; i >= 0; i--) {
            w += tabs[i].width;
            if (w >= this.maxWidth) {
              this.firstVisibleIdx = i;
              break;
            }
          }

          // Now calculate the display left edge and visibility status for
          // each tab.
          const baseX = tabs[0].refX;
          const offset =
            tabs[this.lastVisibleIdx].refX +
            tabs[this.lastVisibleIdx].width -
            this.maxWidth -
            baseX;
          tabs.forEach((t) => {
            t.left = t.refX - offset;
            t.visibilityStatus = this.visibilityStatus(t, baseX, this.maxWidth);
          });
        }
      }
    }

    this.pageTabs = tabs;
    this.pageTabsViewerVM.set({
      align: this.align,
      firstVisibleIdx: this.firstVisibleIdx,
      lastVisibleIdx: this.lastVisibleIdx,
      scrolled: this.isScrolled(this.pageTabs),
      overflowed: this.isOverflowed(this.pageTabs),
    });
  }

  private isScrolled(tabs: PageTab[]): boolean {
    if (tabs.length <= 0) {
      return false;
    }
    return tabs[0].visibilityStatus !== 'visible';
  }

  private isOverflowed(tabs: PageTab[]): boolean {
    if (tabs.length <= 0) {
      return false;
    }
    return tabs[tabs.length - 1].visibilityStatus !== 'visible';
  }

  private visibilityStatus(t: PageTab, baseX: number, maxWidth: number): TabVisibilityStatus {
    if (t.left + t.width <= baseX || t.left >= baseX + maxWidth) {
      return 'hidden';
    } else if (
      (t.left < baseX && t.left + t.width > baseX) ||
      (t.left < baseX + maxWidth && t.left + t.width > baseX + maxWidth)
    ) {
      return 'partially-visible';
    }
    return 'visible';
  }
}
