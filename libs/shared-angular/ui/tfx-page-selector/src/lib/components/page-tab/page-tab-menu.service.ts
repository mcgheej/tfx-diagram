import { Injectable } from '@angular/core';
import { ContextMenu, MenuBuilderService } from '@tfx-diagram/shared-angular/ui/tfx-menu';
import { of } from 'rxjs';

export const DELETE_PAGE = 'Delete Page';
export const RENAME_PAGE = 'Rename Page';

@Injectable()
export class PageTabMenuService {
  constructor(private mb: MenuBuilderService) {}

  getTabContextMenu(isOnlyPage: boolean): ContextMenu {
    const mb = this.mb;
    return mb.contextMenu(
      {
        id: 'page-tab-context-menu',
        menuItemGroups: [
          {
            items: [
              mb.commandItem({
                // icon: 'delete_outline',
                icon: 'delete',
                label: DELETE_PAGE,
                disabled$: of(isOnlyPage),
              }),
              mb.commandItem({
                // icon: 'drive_file_rename_outline',
                icon: 'drive_file_rename',
                label: RENAME_PAGE,
              }),
            ],
          },
        ],
      },
      {
        fontSizePixels: 16,
        itemTextColor: '#282c33',
        outlinedIcons: true,
      }
    );
  }
}
