/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  BaseActionObject,
  Interpreter,
  ResolveTypegenMeta,
  ServiceMap,
  TypegenDisabled,
} from 'xstate';
import { SubMenuComponent } from '../../menu-components/sub-menu/sub-menu.component';
import { PopupMenuConfig } from '../../types/menu-config.types';
import { MenuOptionsProps } from '../../types/menu-options.types';
import { MenuItem, MenuItemGroup } from '../menu-item-classes';
import { Menu } from './menu';
import { PopupMenuEvent } from './xstate/events.xstate';
import { getService, PopupMenuStateSchema } from './xstate/popup-menu.xstate';

export abstract class PopupMenu extends Menu {
  public menuItemGroups: MenuItemGroup[];

  public subMenuComponent: SubMenuComponent | null;
  private xstateService: Interpreter<
    PopupMenu,
    PopupMenuStateSchema,
    PopupMenuEvent,
    any,
    ResolveTypegenMeta<
      TypegenDisabled,
      PopupMenuEvent,
      BaseActionObject,
      ServiceMap
    >
  > | null;

  constructor(config: PopupMenuConfig, options: MenuOptionsProps) {
    super(config, options);
    this.menuItemGroups = config.menuItemGroups ?? [];
    this.initialiseMenuItems();
    this.xstateService = null;
    this.subMenuComponent = null;
  }

  public startStateMachine() {
    if (this.xstateService) {
      this.xstateService.stop();
    }
    this.xstateService = getService(this.id, this);
    this.xstateService.onTransition((state) => {
      let initial = true;
      if (state.changed || initial) {
        initial = false;
      }
    });
    this.xstateService.start();
  }

  public stopStateMachine() {
    if (this.xstateService) {
      this.xstateService.stop();
      this.xstateService = null;
    }
  }

  public backdropClick() {
    if (this.xstateService) {
      this.xstateService.send({ type: 'CLICK_BACKDROP' });
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public override executableClick(item: MenuItem) {
    if (this.xstateService) {
      this.xstateService.send({ type: 'EXECUTE_COMMAND' });
    }
  }

  public enterItem(item: MenuItem) {
    if (this.xstateService) {
      this.xstateService.send({ type: 'ENTER_ITEM', item });
    }
  }

  public leaveItem() {
    if (this.xstateService) {
      this.xstateService.send({ type: 'LEAVE_ITEM' });
    }
  }

  public override overSubMenu() {
    if (this.xstateService) {
      this.xstateService.send({ type: 'OVER_SUB_MENU' });
    }
  }

  protected initialiseMenuItems(): void {
    for (const group of this.menuItemGroups) {
      for (const item of group.items) {
        item.initialise(this);
      }
    }
  }
}
