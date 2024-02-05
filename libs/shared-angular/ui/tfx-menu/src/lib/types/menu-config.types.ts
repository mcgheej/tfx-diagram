/**
 * Defines the config types for the menu class hierarchy
 */
import { AppMenuItem } from '../classes/menu-item-classes/app-menu-item';
import { MenuItemGroup } from '../classes/menu-item-classes/menu-item-group';
import { MenuCategory } from './menu-category.type';

export interface MenuProps {
  id: string;
  type: MenuCategory;
}

export interface PopupMenuProps extends MenuProps {
  menuItemGroups: MenuItemGroup[];
}

export interface AppMenuProps extends MenuProps {
  appMenuItems: AppMenuItem[];
}

export type MenuConfig = Partial<MenuProps>;
export type AppMenuConfig = Partial<AppMenuProps>;
export type PopupMenuConfig = Partial<PopupMenuProps>;
export type SubMenuConfig = PopupMenuConfig;
export type ContextMenuConfig = PopupMenuConfig;
