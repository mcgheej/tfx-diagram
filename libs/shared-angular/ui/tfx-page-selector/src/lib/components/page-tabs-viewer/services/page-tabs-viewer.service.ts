import { ElementRef, Injectable, QueryList, inject, signal } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PageRenameDetails } from '@tfx-diagram/diagram/ui/page-selector';
import {
  PageTabData,
  PageTabsScrollSignals,
  PageTabsViewerVM,
  TabsViewerData,
} from '../page-tabs-viewer.types';
import { findForwardOverflowTabIdx, sumWidths } from './helpers';

@Injectable()
export class PageTabsViewerService implements PageTabsScrollSignals {
  // Injected services
  snackBar = inject(MatSnackBar);

  // PageTabsScrollSignals interface
  overflowed = signal<boolean>(false);
  scrolled = signal<boolean>(false);
  pageTabsViewerVM = signal<PageTabsViewerVM>({
    align: 'left',
    startIdx: 0,
    endIdx: 0,
  });

  viewerData = this.getDefaultTabsViewerData(0);

  // Public API

  scrollRightClick() {
    this.scrollRight();
  }

  scrollRight() {
    // This gets called when user clicks scroll button.
    const { maxWidth, tabs } = this.viewerData;
    if (tabs.length < 2) {
      return;
    }

    // If already aligned left then simply decrease startIdx by 1
    const { align, startIdx, endIdx } = this.pageTabsViewerVM();
    if (align === 'left') {
      if (startIdx === 0) {
        return;
      }
      this.pageTabsViewerVM.set({ align, startIdx: startIdx - 1, endIdx });
      this.setScrolledOverflowed(this.viewerData, this.pageTabsViewerVM());
      return;
    }

    const newStart = this.findBackwardOverflowTabIdx(tabs, endIdx, maxWidth);
    if (newStart < 0) {
      return;
    }
    this.pageTabsViewerVM.set({ align: 'left', startIdx: newStart, endIdx: tabs.length - 1 });
    this.setScrolledOverflowed(this.viewerData, this.pageTabsViewerVM());
  }

  scrollLeftClick() {
    this.scrollLeft();
  }

  scrollLeft() {
    // This gets called when user clicks overflow button.
    const { maxWidth, tabs } = this.viewerData;
    if (tabs.length < 2) {
      return;
    }

    // If already aligned right then simply need to increase
    // endIdx by 1 unless already at end
    const { align, startIdx, endIdx } = this.pageTabsViewerVM();
    if (align === 'right') {
      if (endIdx === tabs.length - 1) {
        return;
      }
      this.pageTabsViewerVM.set({ align, startIdx, endIdx: endIdx + 1 });
      this.setScrolledOverflowed(this.viewerData, this.pageTabsViewerVM());
      return;
    }

    // Currently aligned to left so need to change this to
    // right. Next need to find out the index of the first
    // hidden or partially hidden tab.
    const newEnd = findForwardOverflowTabIdx(tabs, startIdx, maxWidth);
    if (newEnd < 0) {
      return;
    }
    this.pageTabsViewerVM.set({ align: 'right', startIdx: 0, endIdx: newEnd });
    this.setScrolledOverflowed(this.viewerData, this.pageTabsViewerVM());
  }

  setViewerData(tabRefs: QueryList<ElementRef> | null, maxWidth: number) {
    if (tabRefs) {
      const result = this.getDefaultTabsViewerData(maxWidth);
      result.tabs = this.getTabsData(tabRefs);

      // Amend width to cater for right margin on all page tabs bar the
      // last tab (it shouldn't have any right margin). Also calculate
      // total width
      if (result.tabs.length > 0) {
        for (let i = 0; i < result.tabs.length - 1; i++) {
          result.tabs[i].width = result.tabs[i + 1].x - result.tabs[i].x;
          result.totalWidth += result.tabs[i].width;
        }
        result.totalWidth += result.tabs[result.tabs.length - 1].width;
      }
      this.viewerData = result;
    }

    const vm = this.pageTabsViewerVM();
    if (vm.align === 'left') {
      this.pageTabsViewerVM.set({
        align: 'left',
        startIdx: vm.startIdx,
        endIdx: this.viewerData.tabs.length - 1,
      });
    } else {
      this.pageTabsViewerVM.set({
        align: 'right',
        startIdx: 0,
        endIdx: this.viewerData.tabs.length - 1,
      });
    }
    this.setScrolledOverflowed(this.viewerData, this.pageTabsViewerVM());
  }

  pageNameAvailable(renameDetails: PageRenameDetails, pages: string[]): boolean {
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

  private getDefaultTabsViewerData(maxWidth: number): TabsViewerData {
    return {
      totalWidth: 0,
      maxWidth,
      tabs: [],
    } as TabsViewerData;
  }

  private getTabsData(tabRefs: QueryList<ElementRef>): PageTabData[] {
    const tabs: PageTabData[] = [];
    tabRefs.forEach((tab) => {
      tabs.push({
        x: tab.nativeElement.offsetLeft,
        y: tab.nativeElement.offsetTop,
        width: tab.nativeElement.offsetWidth,
      });
    });
    return tabs;
  }

  private setScrolledOverflowed(viewerData: TabsViewerData, vm: PageTabsViewerVM) {
    const { maxWidth, totalWidth, tabs } = viewerData;

    if (totalWidth <= maxWidth) {
      this.overflowed.set(false);
      this.scrolled.set(false);
      return;
    }

    const { align, startIdx, endIdx } = vm;
    if (align === 'left') {
      this.scrolled.set(startIdx > 0);
      this.overflowed.set(sumWidths(tabs, startIdx, tabs.length - 1) > maxWidth);
      return;
    }

    this.scrolled.set(sumWidths(tabs, 0, endIdx) > maxWidth);
    this.overflowed.set(endIdx < tabs.length - 1);
  }

  private findBackwardOverflowTabIdx(
    tabs: PageTabData[],
    endIdx: number,
    maxWidth: number
  ): number {
    let w = 0;
    for (let i = endIdx; i >= 0; i--) {
      w += tabs[i].width;
      if (w > maxWidth) {
        return i;
      }
    }
    return -1;
  }
}

/**
 * If we have tabs 0..n, width of tab i is W(i) and total
 * width of tabs i to j (j > i) is W(i..j) and scroll index is s
 *
 * 1. If W(0..n) is <= max width then:
 *
 *    not overflowed
 *    not scrolled
 *
 * or
 * ==
 *
 * 2. If tabs are left aligned
 *
 *    scrolled if s > 0
 *    overflowed if W(s..n) > max width
 *
 * or
 * ==
 *
 * 3. If tabs are right aligned
 *
 *  scrolled if W(0..s) > max width
 *  overflowed if s < n
 *
 */
