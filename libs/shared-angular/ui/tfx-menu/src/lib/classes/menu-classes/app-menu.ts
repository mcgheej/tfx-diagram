/* eslint-disable @typescript-eslint/no-explicit-any */
import { Actor, createActor } from 'xstate5';
import { APP_MENU_DEFAULT_OPTIONS } from '../../defaults';
import { AppMenuComponent } from '../../menu-components/app-menu/app-menu.component';
import { AppMenuConfig } from '../../types/menu-config.types';
import { MenuOptions } from '../../types/menu-options.types';
import { AppMenuItem, ExpandableItem, MenuItem, SubMenuItem } from '../menu-item-classes';
import { Menu } from './menu';
import { SubMenu } from './sub-menu';
import { appMenuMachine } from './xstate5/app-menu.machine';

export class AppMenu extends Menu {
  public appMenuItems: AppMenuItem[];
  public appMenuComponent: AppMenuComponent | null;

  private appMenuMachineActor: Actor<typeof appMenuMachine> | undefined;

  constructor(config: AppMenuConfig, options: MenuOptions) {
    config.type = 'appMenu';
    super(config, { ...APP_MENU_DEFAULT_OPTIONS, ...options });
    this.appMenuItems = config.appMenuItems ?? [];
    this.appMenuComponent = null;
    this.initialiseMenuItems();
    this.assignParentMenuRefsAppMenu(this);
  }

  public startStateMachine() {
    if (this.appMenuMachineActor) {
      this.appMenuMachineActor.stop();
    }
    this.appMenuMachineActor = createActor(appMenuMachine, {
      input: this,
    });
    // this.xstateService.onTransition((state) => {
    //   let initial = true;
    //   if (state.changed || initial) {
    //     initial = false;
    //     console.log(state.value);
    //   }
    // });
    this.appMenuMachineActor.start();
  }

  public stopStateMachine() {
    if (this.appMenuMachineActor) {
      this.appMenuMachineActor.stop();
      this.appMenuMachineActor = undefined;
    }
  }

  public backdropClick() {
    if (this.appMenuMachineActor) {
      this.appMenuMachineActor.send({ type: 'backdrop.click' });
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public override executableClick(item: MenuItem) {
    if (this.appMenuMachineActor) {
      this.appMenuMachineActor.send({ type: 'command.execute' });
    }
  }

  public clickItem(item: AppMenuItem) {
    if (this.appMenuMachineActor) {
      this.appMenuMachineActor.send({ type: 'item.click', item });
    }
  }

  public enterItem(item: AppMenuItem) {
    if (this.appMenuMachineActor) {
      this.appMenuMachineActor.send({ type: 'item.enter', item });
    }
  }

  public leaveItem() {
    if (this.appMenuMachineActor) {
      this.appMenuMachineActor.send({ type: 'item.leave' });
    }
  }

  protected initialiseMenuItems(): void {
    for (const item of this.appMenuItems) {
      item.initialise(this);
    }
  }

  private assignParentMenuRefsAppMenu(menu: AppMenu) {
    for (const appItem of menu.appMenuItems) {
      this.assignParentMenuRefs(appItem.subMenu, menu);
    }
  }

  private assignParentMenuRefs(menu: SubMenu, parentMenu: Menu) {
    menu.parentMenu = parentMenu;
    for (const group of menu.menuItemGroups) {
      for (const item of group.items) {
        if ((item as ExpandableItem).subMenu) {
          this.assignParentMenuRefs((item as SubMenuItem).subMenu, menu);
        }
      }
    }
  }
}
