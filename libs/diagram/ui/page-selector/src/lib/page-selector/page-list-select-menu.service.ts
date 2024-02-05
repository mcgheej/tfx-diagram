import { Injectable } from '@angular/core';
import {
  ContextMenu,
  MenuBuilderService,
  MenuItem,
} from '@tfx-diagram/shared-angular/ui/tfx-menu';
import { of } from 'rxjs';

@Injectable()
export class PageListSelectMenuService {
  constructor(private mb: MenuBuilderService) {}

  getContextMenu(pages: string[], selectedPageIndex: number): ContextMenu {
    const items: MenuItem[] = [];
    let i = 0;
    for (const page of pages) {
      items.push(
        this.mb.checkboxItem({
          label: page,
          checked$: of(selectedPageIndex === i),
        })
      );
      i++;
    }
    return this.mb.contextMenu(
      {
        id: 'page-list-select-menu',
        menuItemGroups: [
          {
            items,
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
