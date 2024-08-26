import { ElementRef, Injectable, inject } from '@angular/core';
import {
  ContextMenu,
  ContextMenuService,
  MenuBuilderService,
  MenuItem,
} from '@tfx-diagram/shared-angular/ui/tfx-menu';
import { FlexibleSubMenuPositioning } from 'libs/shared-angular/ui/tfx-menu/src/lib/popup-menu/popup-menu.service';
import { Observable, of } from 'rxjs';

@Injectable()
export class PageSelectMenuService {
  private contextMenu = inject(ContextMenuService);

  constructor(private mb: MenuBuilderService) {}

  open(pages: string[], selectedPageIndex: number, el: ElementRef): Observable<MenuItem> {
    return this.contextMenu
      .openContextMenu(this.getContextMenu(pages, selectedPageIndex), {
        positioning: {
          type: 'Flexible',
          associatedElement: el,
          positions: [
            {
              originX: 'start',
              originY: 'top',
              overlayX: 'start',
              overlayY: 'bottom',
            },
          ],
        } as FlexibleSubMenuPositioning,
      })
      .afterClosed();
  }

  private getContextMenu(pages: string[], selectedPageIndex: number): ContextMenu {
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
        fontSizePixels: 14,
        itemTextColor: '#282c33',
        outlinedIcons: true,
      }
    );
  }
}
