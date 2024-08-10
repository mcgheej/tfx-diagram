import { TfxPoint } from '../../../page-selector.types';
import {
  INDICATOR_X_OFFSET,
  INDICATOR_Y_OFFSET,
  IndicatorPosition,
} from '../../page-position-indicator/page-position-indicator.config';
import { PageTabData } from '../page-tabs-viewer.types';
import { PageTabsViewerService } from './page-tabs-viewer.service';

export function calcInsertPoint(
  mouseX: number,
  viewerService: PageTabsViewerService
): TfxPoint {
  const { tabs } = viewerService.viewerData;
  if (tabs.length <= 0) {
    // This shouldn't happen but if it does return position out of
    // viewport.
    return { x: -100, y: -100 };
  }

  let indicatorPos = mouseLeftOfViewer(mouseX, viewerService);
  if (indicatorPos) {
    return indicatorPos;
  }

  indicatorPos = mouseRightOfViewer(mouseX, viewerService);
  if (indicatorPos) {
    return indicatorPos;
  }

  return { x: -100, y: -100 };
}

export function sumWidths(tabs: PageTabData[], i: number, j: number): number {
  let w = 0;
  if (j > i) {
    const limit = Math.min(j, tabs.length - 1);
    for (let k = i; k <= limit; k++) {
      w += tabs[k].width;
    }
  }
  return w;
}

export function findForwardOverflowTabIdx(
  tabs: PageTabData[],
  startIdx: number,
  maxWidth: number
): number {
  let w = 0;
  for (let i = startIdx; i < tabs.length; i++) {
    w += tabs[i].width;
    if (w > maxWidth) {
      return i;
    }
  }
  return tabs.length - 1;
}

/**
 *
 * @param p - point to convert
 * @returns - IndicatorPosition object for supplied point.
 */
export function convertPointToIndicatorPosition(p: TfxPoint): IndicatorPosition {
  return {
    left: `${p.x - INDICATOR_X_OFFSET}px`,
    top: `${p.y - INDICATOR_Y_OFFSET}px`,
  };
}

function mouseLeftOfViewer(
  mouseX: number,
  viewerService: PageTabsViewerService
): TfxPoint | null {
  const { align } = viewerService.pageTabsViewerVM();
  const { tabs } = viewerService.viewerData;
  if (mouseX < tabs[0].x) {
    // mouse is left of viewer

    if (align === 'right') {
      viewerService.scrollRight();
    }
    return { x: tabs[0].x, y: tabs[0].y };
  }

  return null;
}

function mouseRightOfViewer(
  mouseX: number,
  viewerService: PageTabsViewerService
): TfxPoint | null {
  const { align } = viewerService.pageTabsViewerVM();
  const { tabs, maxWidth } = viewerService.viewerData;
  const tabViewerMaxX = tabs[0].x + maxWidth - 1;

  if (mouseX > tabViewerMaxX) {
    // mouse is right of viewer

    if (align === 'left') {
      viewerService.scrollLeftClick();
    }
    return { x: tabViewerMaxX, y: tabs[0].y };
  }
  return null;
}
