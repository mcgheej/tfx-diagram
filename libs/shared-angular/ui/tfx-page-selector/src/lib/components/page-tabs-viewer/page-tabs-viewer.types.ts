import { Signal } from '@angular/core';

export interface PageTabsViewerVM {
  align: 'left' | 'right';
  startIdx: number;
  endIdx: number;
}

export interface PageTabsScrollSignals {
  overflowed: Signal<boolean>;
  scrolled: Signal<boolean>;
  pageTabsViewerVM: Signal<PageTabsViewerVM>;
}

export interface PageTabData {
  x: number;
  y: number;
  width: number;
}

export interface TabsViewerData {
  totalWidth: number;
  maxWidth: number;
  tabs: PageTabData[];
}
