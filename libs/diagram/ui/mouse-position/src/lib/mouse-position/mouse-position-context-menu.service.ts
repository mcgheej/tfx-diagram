import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { ViewMenuActions } from '@tfx-diagram/diagram-data-access-store-actions';
import { selectMousePositionCoordsType } from '@tfx-diagram/diagram-data-access-store-features-settings';
import { MousePositionCoordsType } from '@tfx-diagram/electron-renderer-web/shared-types';
import {
  CheckboxItem,
  CommandItem,
  ContextMenu,
  MenuBuilderService,
} from '@tfx-diagram/shared-angular/ui/tfx-menu';
import { map } from 'rxjs';

@Injectable()
export class MousePositionContextMenuService {
  private optionsMenu!: ContextMenu;

  constructor(private store: Store, private mb: MenuBuilderService) {}

  getContextMenu(): ContextMenu {
    this.optionsMenu =
      this.optionsMenu ??
      this.mb.contextMenu({
        id: 'mouse-position-options-menu',
        menuItemGroups: [
          this.mb.menuItemGroup([
            this.mb.checkboxItem({
              label: 'Page Coordinates',
              checked$: this.store
                .select(selectMousePositionCoordsType)
                .pipe(map((value) => value === 'page')),
              exec: this.setCoordsType('page'),
            }),
            this.mb.checkboxItem({
              label: 'Viewport Coordinates',
              checked$: this.store
                .select(selectMousePositionCoordsType)
                .pipe(map((value) => value === 'viewport')),
              exec: this.setCoordsType('viewport'),
            }),
          ]),
          this.mb.menuItemGroup([
            this.mb.commandItem({
              label: 'Hide Position Data',
              exec: this.hidePositionData(),
            }),
          ]),
        ],
      });
    return this.optionsMenu;
  }

  private hidePositionData(): (commandItem: CommandItem) => void {
    return () => {
      this.store.dispatch(ViewMenuActions.showMousePositionToggle());
    };
  }

  private setCoordsType(value: MousePositionCoordsType): (checkboxItem: CheckboxItem) => void {
    return () => {
      this.store.dispatch(ViewMenuActions.mousePositionCoordsTypeChange({ value }));
    };
  }
}
