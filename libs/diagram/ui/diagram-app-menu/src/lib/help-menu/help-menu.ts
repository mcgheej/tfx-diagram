import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import {
  AppMenuItem,
  MenuBuilderService,
  MenuItemGroup,
} from '@tfx-diagram/shared-angular/ui/tfx-menu';
import { AboutCommand } from './commands/about-command';

export class HelpMenu {
  private about = new AboutCommand(this.mb, this.store, this.dialog);

  private helpMenuItem: AppMenuItem = this.mb.appMenuItem({
    label: 'Help',
    subMenu: this.mb.subMenu({
      id: 'help-sub-menu',
      menuItemGroups: this.getMenuItemGroups(),
    }),
  });

  constructor(
    private mb: MenuBuilderService,
    private store: Store,
    private dialog: MatDialog
  ) {}

  getItem(): AppMenuItem {
    return this.helpMenuItem;
  }

  cleanup() {
    this.about.cleanup();
  }

  private getMenuItemGroups(): MenuItemGroup[] {
    return [this.mb.menuItemGroup([this.about.getItem()])];
  }
}
