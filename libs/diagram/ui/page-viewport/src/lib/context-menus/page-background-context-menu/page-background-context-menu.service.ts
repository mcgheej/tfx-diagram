import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Point, Size } from '@tfx-diagram/electron-renderer-web/shared-types';
import {
  ContextMenu,
  ContextMenuService,
  GlobalSubMenuPositioning,
  MenuBuilderService,
} from '@tfx-diagram/shared-angular/ui/tfx-menu';
import { getInsertArc } from './insert-arc';
import { getInsertCircle } from './insert-circle';
import { getInsertCurve } from './insert-curve';
import { getInsertLine } from './insert-line';
import { getInsertRectangle } from './insert-rectangle';
import { getInsertText } from './insert-text';
import { getInsertTriangle } from './insert-triangle';

@Injectable()
export class PageBackgroundContextMenuService {
  private store = inject(Store);
  private contextMenu = inject(ContextMenuService);
  private mb = inject(MenuBuilderService);

  open({ x: viewportX, y: viewportY }: Point, viewportOffset: Point, viewportSize: Size) {
    const { width: cWidth, height: cHeight } = this.contextMenuSize();
    let x = viewportX;
    let y = viewportY;
    if (x + cWidth >= viewportSize.width) {
      x = viewportSize.width - cWidth;
      x = Math.max(0, x);
    }
    if (y + cHeight >= viewportSize.height) {
      y = viewportSize.height - cHeight;
      y = Math.max(0, y);
    }
    this.contextMenu
      .openContextMenu(getContextMenu(this.store, this.mb, { x: viewportX, y: viewportY }), {
        positioning: {
          type: 'Global',
          left: x + viewportOffset.x,
          top: y + viewportOffset.y,
        } as GlobalSubMenuPositioning,
      })
      .afterClosed()
      .subscribe({
        complete: () => null,
      });
  }

  contextMenuSize(): Size {
    return { width: 232, height: 187 };
  }
}

function getContextMenu(store: Store, mb: MenuBuilderService, position: Point): ContextMenu {
  return mb.contextMenu({
    id: 'page-background-context-menu',
    menuItemGroups: [
      mb.menuItemGroup([
        getInsertCircle(store, mb, position),
        getInsertRectangle(store, mb, position),
        getInsertArc(store, mb, position),
        getInsertCurve(store, mb, position),
        getInsertLine(store, mb, position),
        getInsertTriangle(store, mb, position),
        getInsertText(store, mb, position),
      ]),
    ],
  });
}
