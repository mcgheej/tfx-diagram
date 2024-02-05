import {
  AppMenuItem,
  MenuBuilderService,
} from '@tfx-diagram/shared-angular/ui/tfx-menu';
import { aboutCommand } from './commands/about-command';

export class HelpMenu {
  private helpMenuItem: AppMenuItem | null = null;

  constructor(private mb: MenuBuilderService) {}
  getItem(): AppMenuItem {
    if (this.helpMenuItem) {
      this.cleanup();
    }
    this.helpMenuItem = this.mb.appMenuItem({
      label: 'Help',
      subMenu: this.mb.subMenu({
        id: 'help-sub-menu',
        menuItemGroups: [this.mb.menuItemGroup([aboutCommand(this.mb)])],
      }),
    });
    return this.helpMenuItem;
  }

  cleanup() {
    this.helpMenuItem = null;
  }
}
