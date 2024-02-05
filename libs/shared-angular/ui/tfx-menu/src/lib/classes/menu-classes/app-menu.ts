/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  BaseActionObject,
  Interpreter,
  ResolveTypegenMeta,
  ServiceMap,
  TypegenDisabled,
} from 'xstate';
import { APP_MENU_DEFAULT_OPTIONS } from '../../defaults';
import { AppMenuComponent } from '../../menu-components/app-menu/app-menu.component';
import { AppMenuConfig } from '../../types/menu-config.types';
import { MenuOptions } from '../../types/menu-options.types';
import {
  AppMenuItem,
  ExpandableItem,
  MenuItem,
  SubMenuItem,
} from '../menu-item-classes';
import { Menu } from './menu';
import { SubMenu } from './sub-menu';
import { getService } from './xstate/app-menu.xstate';
import { AppMenuEvent } from './xstate/events.xstate';

export class AppMenu extends Menu {
  public appMenuItems: AppMenuItem[];
  public appMenuComponent: AppMenuComponent | null;

  private xstateService: Interpreter<
    AppMenu,
    any,
    AppMenuEvent,
    {
      value: any;
      context: AppMenu;
    },
    ResolveTypegenMeta<
      TypegenDisabled,
      AppMenuEvent,
      BaseActionObject,
      ServiceMap
    >
  > | null;

  constructor(config: AppMenuConfig, options: MenuOptions) {
    config.type = 'appMenu';
    super(config, { ...APP_MENU_DEFAULT_OPTIONS, ...options });
    this.appMenuItems = config.appMenuItems ?? [];
    this.appMenuComponent = null;
    this.initialiseMenuItems();
    this.assignParentMenuRefsAppMenu(this);
    this.xstateService = null;
  }

  public startStateMachine() {
    if (this.xstateService) {
      this.xstateService.stop();
    }
    this.xstateService = getService(this.id, this);
    // this.xstateService.onTransition((state) => {
    //   let initial = true;
    //   if (state.changed || initial) {
    //     initial = false;
    //     console.log(state.value);
    //   }
    // });
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

  public clickItem(item: AppMenuItem) {
    if (this.xstateService) {
      this.xstateService.send({ type: 'CLICK_ITEM', item });
    }
  }

  public enterItem(item: AppMenuItem) {
    if (this.xstateService) {
      this.xstateService.send({ type: 'ENTER_ITEM', item });
    }
  }

  public leaveItem() {
    if (this.xstateService) {
      this.xstateService.send({ type: 'LEAVE_ITEM' });
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
