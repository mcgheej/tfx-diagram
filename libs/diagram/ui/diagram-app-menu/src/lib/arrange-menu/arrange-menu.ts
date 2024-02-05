import { Store } from '@ngrx/store';
import { selectStatus } from '@tfx-diagram/diagram-data-access-store-features-sketchbook';
import {
  AppMenuItem,
  MenuBuilderService,
  MenuItemGroup,
} from '@tfx-diagram/shared-angular/ui/tfx-menu';
import { HotkeysService } from 'angular2-hotkeys';
import { map } from 'rxjs';
import { BringItemForwardCommand } from './commands/bring-item-forward.command';
import { BringToFrontCommand } from './commands/bring-to-front.command';
import { GroupCommand } from './commands/group.command';
import { SendItemBackwardCommand } from './commands/send-item-backward.command';
import { SendToBackCommand } from './commands/send-to-back.command';
import { UngroupCommand } from './commands/ungroup.command';
import { AlignObjectsSubMenu } from './sub-menus/align-objects/align-objects.sub-menu';
import { DistributeObjectsSubMenu } from './sub-menus/distribute-objects/distribute-objects.sub-menu';
import { MatchSizeSubMenu } from './sub-menus/match-size/match-size.sub-menu';

export class ArrangeMenu {
  private bringToFrontCmd = new BringToFrontCommand(this.mb, this.store, this.hotkeysService);
  private sendToBackCmd = new SendToBackCommand(this.mb, this.store, this.hotkeysService);
  private bringItemForwardCmd = new BringItemForwardCommand(this.mb, this.store);
  private sendItemBackwardCmd = new SendItemBackwardCommand(this.mb, this.store);

  private alignObjectsSubMenu = new AlignObjectsSubMenu(this.mb, this.store);
  private distributeObjectsSubMenu = new DistributeObjectsSubMenu(this.mb, this.store);
  private matchSizeSubMenu = new MatchSizeSubMenu(this.mb, this.store);

  private groupCmd = new GroupCommand(this.mb, this.store, this.hotkeysService);
  private ungroupCmd = new UngroupCommand(this.mb, this.store, this.hotkeysService);

  private arrangeMenuItem: AppMenuItem = this.mb.appMenuItem({
    label: 'Arrange',
    visible$: this.store.select(selectStatus).pipe(map((status) => status !== 'closed')),
    subMenu: this.mb.subMenu({
      id: 'arrange-sub-menu',
      menuItemGroups: this.getMenuItemGroups(),
    }),
  });

  constructor(
    private mb: MenuBuilderService,
    private store: Store,
    private hotkeysService: HotkeysService
  ) {}

  getItem(): AppMenuItem {
    return this.arrangeMenuItem;
  }

  cleanup() {
    this.bringToFrontCmd.cleanup();
    this.sendToBackCmd.cleanup();
    this.bringItemForwardCmd.cleanup();
    this.sendItemBackwardCmd.cleanup();
    this.alignObjectsSubMenu.cleanup();
    this.distributeObjectsSubMenu.cleanup();
    this.matchSizeSubMenu.cleanup();
    this.groupCmd.cleanup();
    this.ungroupCmd.cleanup();
  }

  private getMenuItemGroups(): MenuItemGroup[] {
    return [
      this.mb.menuItemGroup([
        this.bringToFrontCmd.getItem(),
        this.sendToBackCmd.getItem(),
        this.bringItemForwardCmd.getItem(),
        this.sendItemBackwardCmd.getItem(),
      ]),
      this.mb.menuItemGroup([
        this.alignObjectsSubMenu.getItem(),
        this.distributeObjectsSubMenu.getItem(),
        this.matchSizeSubMenu.getItem(),
      ]),
      this.mb.menuItemGroup([this.groupCmd.getItem(), this.ungroupCmd.getItem()]),
    ];
  }
}
