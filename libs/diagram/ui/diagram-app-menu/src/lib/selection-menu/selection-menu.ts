import { Store } from '@ngrx/store';
import { selectStatus } from '@tfx-diagram/diagram-data-access-store-features-sketchbook';
import {
  AppMenuItem,
  MenuBuilderService,
  MenuItemGroup,
} from '@tfx-diagram/shared-angular/ui/tfx-menu';
import { HotkeysService } from 'angular2-hotkeys';
import { map } from 'rxjs';
import { InverseSelectionCommand } from './commands/inverse-selection.command';
import { SelectAllCommand } from './commands/select-all.command';

export class SelectionMenu {
  private selectAllCmd = new SelectAllCommand(this.mb, this.store, this.hotkeysService);
  private inverseSelectionCmd = new InverseSelectionCommand(this.mb, this.store);

  private selectionMenuItem: AppMenuItem = this.mb.appMenuItem({
    label: 'Selection',
    visible$: this.store.select(selectStatus).pipe(map((status) => status !== 'closed')),
    subMenu: this.mb.subMenu({
      id: 'selection-sub-menu',
      menuItemGroups: this.getMenuItemGroups(),
    }),
  });

  constructor(
    private mb: MenuBuilderService,
    private store: Store,
    private hotkeysService: HotkeysService
  ) {}

  getItem(): AppMenuItem {
    return this.selectionMenuItem;
  }

  cleanup() {
    this.selectAllCmd.cleanup();
    this.inverseSelectionCmd.cleanup();
  }

  private getMenuItemGroups(): MenuItemGroup[] {
    return [
      this.mb.menuItemGroup([this.selectAllCmd.getItem(), this.inverseSelectionCmd.getItem()]),
    ];
  }
}
