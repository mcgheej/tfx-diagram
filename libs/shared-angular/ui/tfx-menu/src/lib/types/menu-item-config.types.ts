import { Observable } from 'rxjs';
import { SubMenu } from '../classes/menu-classes/sub-menu';
import { CheckboxItem } from '../classes/menu-item-classes';
import { CommandItem } from '../classes/menu-item-classes/command-item';
import { MenuItemCategory } from './menu-item-category.type';
import { PartPartial } from './part-partial.type';

interface MenuItemProps {
  id: string;
  type: MenuItemCategory;
  label: string;
  disabled$: Observable<boolean>;
  visible$: Observable<boolean>;
}

export interface CommandItemProps extends MenuItemProps {
  icon: string;
  subLabel: string;
  exec: (cmd: CommandItem) => void;
}

export interface CheckboxItemProps extends MenuItemProps {
  checked$: Observable<boolean>;
  subLabel: string;
  exec: (cmd: CheckboxItem) => void;
}

export interface ExpandableItemProps extends MenuItemProps {
  subMenu: SubMenu;
}

export type ExpandableItemConfig = PartPartial<ExpandableItemProps, 'subMenu'>;

export type MenuItemConfig = Partial<MenuItemProps>;
export type AppMenuItemConfig = ExpandableItemConfig;
export type CommandItemConfig = Partial<CommandItemProps>;
export type CheckboxItemConfig = Partial<CheckboxItemProps>;
export type SubMenuItemConfig = ExpandableItemConfig;
