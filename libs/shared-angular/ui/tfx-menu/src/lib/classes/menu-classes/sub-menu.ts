import { SUB_MENU_DEFAULT_OPTIONS } from '../../defaults';
import { SubMenuConfig } from '../../types/menu-config.types';
import { MenuOptions } from '../../types/menu-options.types';
import { MenuItem } from '../menu-item-classes';
import { Menu } from './menu';
import { PopupMenu } from './popup-menu';

export class SubMenu extends PopupMenu {
  public parentMenu!: Menu;

  constructor(config: SubMenuConfig, options: MenuOptions) {
    config.type = 'subMenu';
    super(config, { ...SUB_MENU_DEFAULT_OPTIONS, ...options });
  }

  public override executableClick(item: MenuItem) {
    super.executableClick(item);
    this.parentMenu.executableClick(item);
  }
}
