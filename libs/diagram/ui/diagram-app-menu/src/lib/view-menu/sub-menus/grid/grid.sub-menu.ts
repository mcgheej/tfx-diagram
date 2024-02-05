import { Store } from '@ngrx/store';
import { MenuBuilderService, SubMenuItem } from '@tfx-diagram/shared-angular/ui/tfx-menu';
import { HotkeysService } from 'angular2-hotkeys';
import { GridShowCheckbox } from './commands/grid-show.checkbox';
import { GridSnapCheckbox } from './commands/grid-snap.checkbox';

export class GridSubMenu {
  private gridShowCheckbox = new GridShowCheckbox(this.mb, this.store, this.hotkeysService);
  private gridSnapCheckbox = new GridSnapCheckbox(this.mb, this.store);

  private gridSubMenu: SubMenuItem = this.mb.subMenuItem({
    label: 'Grid',
    subMenu: this.mb.subMenu({
      id: 'view-grid-sub-menu',
      menuItemGroups: [
        this.mb.menuItemGroup([
          this.gridShowCheckbox.getItem(),
          this.gridSnapCheckbox.getItem(),
        ]),
      ],
    }),
  });

  constructor(
    private mb: MenuBuilderService,
    private store: Store,
    private hotkeysService: HotkeysService
  ) {}

  getItem(): SubMenuItem {
    return this.gridSubMenu;
  }

  cleanup() {
    this.gridShowCheckbox.cleanup();
    this.gridSnapCheckbox.cleanup();
  }
}
