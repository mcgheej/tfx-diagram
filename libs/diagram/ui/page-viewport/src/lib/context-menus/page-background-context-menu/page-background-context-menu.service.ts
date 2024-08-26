import { Injectable, inject } from '@angular/core';
import { Point, Size } from '@tfx-diagram/electron-renderer-web/shared-types';
import {
  ContextMenu,
  ContextMenuService,
  MenuBuilderService,
} from '@tfx-diagram/shared-angular/ui/tfx-menu';
import { GlobalSubMenuPositioning } from 'libs/shared-angular/ui/tfx-menu/src/lib/popup-menu/popup-menu.service';

@Injectable()
export class PageBackgroundContextMenuService {
  private contextMenu = inject(ContextMenuService);
  private mb = inject(MenuBuilderService);

  open({ x, y }: Point) {
    console.log(`Open menu at (${x}, ${y})`);
    this.contextMenu
      .openContextMenu(getContextMenu(this.mb), {
        positioning: {
          type: 'Global',
          left: x,
          top: y,
        } as GlobalSubMenuPositioning,
      })
      .afterClosed()
      .subscribe({
        complete: () => console.log('closed menu'),
      });
  }

  contextMenuSize(): Size {
    return { width: 232, height: 187 };
  }
}

function getContextMenu(mb: MenuBuilderService): ContextMenu {
  return mb.contextMenu({
    id: 'page-background-context-menu',
    menuItemGroups: [
      mb.menuItemGroup([
        mb.commandItem({
          label: 'Insert Circle',
          // exec
        }),
        mb.commandItem({
          label: 'Insert Rectangle',
        }),
        mb.commandItem({
          label: 'Insert Arc',
        }),
        mb.commandItem({
          label: 'Insert Curve',
        }),
        mb.commandItem({
          label: 'Insert Line',
        }),
        mb.commandItem({
          label: 'Insert Triangle',
        }),
        mb.commandItem({
          label: 'Insert Text',
        }),
      ]),
    ],
  });
}
