import { Store } from '@ngrx/store';
import { MenuBuilderService, SubMenuItem } from '@tfx-diagram/shared-angular/ui/tfx-menu';
import { MatchHeightCommand } from './commands/match-height.command';
import { MatchWidthAndHeightCommand } from './commands/match-width-and-height.command';
import { MatchWidthCommand } from './commands/match-width.command';

export class MatchSizeSubMenu {
  private matchWidthAndHeightCmd = new MatchWidthAndHeightCommand(this.mb, this.store);
  private matchWidthCmd = new MatchWidthCommand(this.mb, this.store);
  private matchHeightCmd = new MatchHeightCommand(this.mb, this.store);

  private matchSizeSubMenu: SubMenuItem = this.mb.subMenuItem({
    label: 'Match Size',
    subMenu: this.mb.subMenu({
      id: 'arrange-match-size-sub-menu',
      menuItemGroups: [
        this.mb.menuItemGroup([
          this.matchWidthAndHeightCmd.getItem(),
          this.matchWidthCmd.getItem(),
          this.matchHeightCmd.getItem(),
        ]),
      ],
    }),
  });

  constructor(private mb: MenuBuilderService, private store: Store) {}

  getItem(): SubMenuItem {
    return this.matchSizeSubMenu;
  }

  cleanup() {
    this.matchWidthAndHeightCmd.cleanup();
    this.matchWidthCmd.cleanup();
    this.matchHeightCmd.cleanup();
  }
}
