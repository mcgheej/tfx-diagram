import { Store } from '@ngrx/store';
import { MenuBuilderService, SubMenuItem } from '@tfx-diagram/shared-angular/ui/tfx-menu';
import { AlignObjectsBottomCommand } from './commands/align-objects-bottom.command';
import { AlignObjectsCenterCommand } from './commands/align-objects-center.command';
import { AlignObjectsLeftCommand } from './commands/align-objects-left.command';
import { AlignObjectsMiddleCommand } from './commands/align-objects-middle.command';
import { AlignObjectsRightCommand } from './commands/align-objects-right.command';
import { AlignObjectsTopCommand } from './commands/align-objects-top.command';

export class AlignObjectsSubMenu {
  private alignObjectsLeftCmd = new AlignObjectsLeftCommand(this.mb, this.store);
  private alignObjectsCenterCmd = new AlignObjectsCenterCommand(this.mb, this.store);
  private alignObjectsRightCmd = new AlignObjectsRightCommand(this.mb, this.store);
  private alignObjectsTopCmd = new AlignObjectsTopCommand(this.mb, this.store);
  private alignObjectsMiddleCmd = new AlignObjectsMiddleCommand(this.mb, this.store);
  private alignObjectsBottomCmd = new AlignObjectsBottomCommand(this.mb, this.store);

  private alignObjectsSubMenu: SubMenuItem = this.mb.subMenuItem({
    label: 'Align Objects',
    subMenu: this.mb.subMenu({
      id: 'arrange-align-objects-sub-menu',
      menuItemGroups: [
        this.mb.menuItemGroup([
          this.alignObjectsLeftCmd.getItem(),
          this.alignObjectsCenterCmd.getItem(),
          this.alignObjectsRightCmd.getItem(),
        ]),
        this.mb.menuItemGroup([
          this.alignObjectsTopCmd.getItem(),
          this.alignObjectsMiddleCmd.getItem(),
          this.alignObjectsBottomCmd.getItem(),
        ]),
      ],
    }),
  });

  constructor(private mb: MenuBuilderService, private store: Store) {}

  getItem(): SubMenuItem {
    return this.alignObjectsSubMenu;
  }

  cleanup() {
    this.alignObjectsLeftCmd.cleanup();
    this.alignObjectsCenterCmd.cleanup();
    this.alignObjectsRightCmd.cleanup();
    this.alignObjectsTopCmd.cleanup();
    this.alignObjectsMiddleCmd.cleanup();
    this.alignObjectsBottomCmd.cleanup();
  }
}
