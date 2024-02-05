import { Injectable } from '@angular/core';
import { AppMenu, ContextMenu, SubMenu } from './classes/menu-classes';
import {
  AppMenuItem,
  CheckboxItem,
  CommandItem,
  MenuItem,
  MenuItemGroup,
  SubMenuItem,
} from './classes/menu-item-classes';
import { AppMenuItemComponent } from './menu-item-components/app-menu-item/app-menu-item.component';
import { CheckboxItemComponent } from './menu-item-components/checkbox-item/checkbox-item.component';
import { CommandItemComponent } from './menu-item-components/command-item/command-item.component';
import { SubMenuItemComponent } from './menu-item-components/sub-menu-item/sub-menu-item.component';
import {
  AppMenuConfig,
  AppMenuItemConfig,
  CheckboxItemConfig,
  CommandItemConfig,
  ContextMenuConfig,
  MenuOptions,
  SubMenuConfig,
  SubMenuItemConfig,
} from './types';

@Injectable()
export class MenuBuilderService {
  public appMenu(
    config: AppMenuConfig = {},
    options: Partial<MenuOptions> = {}
  ): AppMenu {
    return new AppMenu(config, options);
  }

  public contextMenu(
    config: ContextMenuConfig = {},
    options: Partial<MenuOptions> = {}
  ): ContextMenu {
    return new ContextMenu(config, options);
  }

  public subMenu(
    config: SubMenuConfig = {},
    options: Partial<MenuOptions> = {}
  ): SubMenu {
    return new SubMenu(config, options);
  }

  public menuItemGroup(items: MenuItem[]): MenuItemGroup {
    return new MenuItemGroup(items);
  }

  public commandItem(config: CommandItemConfig): CommandItem {
    return new CommandItem(config, CommandItemComponent);
  }

  public checkboxItem(config: CheckboxItemConfig): CheckboxItem {
    return new CheckboxItem(config, CheckboxItemComponent);
  }

  public subMenuItem(config: SubMenuItemConfig): SubMenuItem {
    return new SubMenuItem(config, SubMenuItemComponent);
  }

  public appMenuItem(config: AppMenuItemConfig): AppMenuItem {
    return new AppMenuItem(config, AppMenuItemComponent);
  }
}
