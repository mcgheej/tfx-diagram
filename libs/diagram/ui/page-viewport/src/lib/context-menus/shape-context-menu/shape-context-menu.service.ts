import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Shape } from '@tfx-diagram/diagram/data-access/shape-classes';
import { Point, Size } from '@tfx-diagram/electron-renderer-web/shared-types';
import {
  ContextMenu,
  ContextMenuService,
  GlobalSubMenuPositioning,
  MenuBuilderService,
} from '@tfx-diagram/shared-angular/ui/tfx-menu';
import { getBringItemForward } from './bring-item-forward';
import { getBringToFront } from './bring-to-front';
import { getCopy } from './copy';
import { getCut } from './cut';
import { getDelete } from './delete';
import { getDuplicate } from './duplicate';
import { getSendItemBackward } from './send-item-backward';
import { getSendToBack } from './send-to-back';

@Injectable()
export class ShapeContextMenuService {
  private store = inject(Store);
  private contextMenu = inject(ContextMenuService);
  private mb = inject(MenuBuilderService);

  open(
    { x: viewportX, y: viewportY }: Point,
    shapeUnderMouse: Shape,
    viewportOffset: Point,
    viewportSize: Size
  ) {
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
      .openContextMenu(getContextMenu(this.store, this.mb, shapeUnderMouse), {
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

  private contextMenuSize(): Size {
    return { width: 271, height: 166 };
  }
}

function getContextMenu(
  store: Store,
  mb: MenuBuilderService,
  shapeUnderMouse: Shape
): ContextMenu {
  return mb.contextMenu({
    id: 'shape-context-menu',
    menuItemGroups: [
      mb.menuItemGroup([
        getBringToFront(store, mb),
        getSendToBack(store, mb),
        getBringItemForward(store, mb, shapeUnderMouse),
        getSendItemBackward(store, mb, shapeUnderMouse),
      ]),
      mb.menuItemGroup([getCut(store, mb), getCopy(store, mb), getDuplicate(store, mb)]),
      mb.menuItemGroup([getDelete(store, mb)]),
    ],
  });
}
