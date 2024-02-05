import { Store } from '@ngrx/store';
import { MenuBuilderService, SubMenuItem } from '@tfx-diagram/shared-angular/ui/tfx-menu';
import { DistributeObjectsHorizontallyCommand } from './commands/distribute-objects-horizontally.command';
import { DistributeObjectsVerticallyCommand } from './commands/distribute-objects-vertically.command';

export class DistributeObjectsSubMenu {
  private distributeObjectsVertically = new DistributeObjectsVerticallyCommand(
    this.mb,
    this.store
  );
  private distributeObjectsHorizontally = new DistributeObjectsHorizontallyCommand(
    this.mb,
    this.store
  );

  private distributeObjectsSubMenu: SubMenuItem = this.mb.subMenuItem({
    label: 'Distribute Objects',
    subMenu: this.mb.subMenu({
      id: 'arrange-distribute-objects-sub-menu',
      menuItemGroups: [
        this.mb.menuItemGroup([
          this.distributeObjectsVertically.getItem(),
          this.distributeObjectsHorizontally.getItem(),
        ]),
      ],
    }),
  });

  constructor(private mb: MenuBuilderService, private store: Store) {}

  getItem(): SubMenuItem {
    return this.distributeObjectsSubMenu;
  }

  cleanup() {
    this.distributeObjectsVertically.cleanup();
    this.distributeObjectsHorizontally.cleanup();
  }
}
