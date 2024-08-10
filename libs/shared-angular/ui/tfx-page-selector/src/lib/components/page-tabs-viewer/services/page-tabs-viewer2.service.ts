import { ElementRef, Injectable, QueryList, Signal, computed, signal } from '@angular/core';

type TabVisibilityStatus = 'hidden' | 'partially-visible' | 'visible';
type ViewerAlignment = 'left' | 'right';

interface PageTab {
  refX: number;
  refY: number;
  width: number;
  left: number;
  visibilityStatus: TabVisibilityStatus;
}

interface PageTabsViewerVM {
  align: ViewerAlignment;
  firstVisibleIdx: number;
  lastVisibleIdx: number;
}

const initialPageTabsViewerVM: PageTabsViewerVM = {
  align: 'left',
  firstVisibleIdx: 0,
  lastVisibleIdx: 0,
};

@Injectable()
export class PageTabsViewerService2 {
  pageTabsViewerVM = signal<PageTabsViewerVM>(initialPageTabsViewerVM);
  scrolled: Signal<boolean> = computed(() => {
    if (this.pageTabs.length <= 0) {
      return false;
    }
    return this.pageTabs[0].visibilityStatus !== 'visible';
  });
  overflowed: Signal<boolean> = computed(() => {
    if (this.pageTabs.length <= 0) {
      return false;
    }
    return this.pageTabs[this.pageTabs.length - 1].visibilityStatus !== 'visible';
  });

  //
  private maxWidth = 300;
  private tabRefs: QueryList<ElementRef> | null = null;
  private pageTabs: PageTab[] = [];
  private totalWidth = 0;
  private align: ViewerAlignment = 'left';
  private firstVisibleIdx = 0;
  private lastVisibleIdx = 0;

  maxWidthChanged(maxWidth: number) {
    this.maxWidth = maxWidth;
    this.setPageTabs();
  }

  tabRefsChanged(tabRefs: QueryList<ElementRef> | null) {
    this.tabRefs = tabRefs ?? null;
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
          // viewer and the last tab visible is given by the index value
          // in "lastVisibleIdx". Need to calculate the index of the first
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
    console.log(`align: ${this.align}`);
    console.log(`firstVisibleIdx: ${this.firstVisibleIdx}`);
    console.log(`lastVisibleIdx: ${this.lastVisibleIdx}`);
    console.log(this.pageTabs);
    this.pageTabsViewerVM.set({
      align: this.align,
      firstVisibleIdx: this.firstVisibleIdx,
      lastVisibleIdx: this.lastVisibleIdx,
    });
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
