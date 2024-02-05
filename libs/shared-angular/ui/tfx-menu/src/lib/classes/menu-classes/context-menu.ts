import { CONTEXT_MENU_DEFAULT_OPTIONS } from '../../defaults';
import { ContextMenuConfig } from '../../types/menu-config.types';
import { MenuOptions } from '../../types/menu-options.types';
import { MenuItem } from '../menu-item-classes';
import { ExpandableItem } from '../menu-item-classes/expandable-item';
import { SubMenuItem } from '../menu-item-classes/sub-menu-item';
import { Menu } from './menu';
import { PopupMenu } from './popup-menu';
import { SubMenu } from './sub-menu';

export class ContextMenu extends PopupMenu {
  constructor(config: ContextMenuConfig, options: MenuOptions) {
    config.type = 'contextMenu';
    super(config, { ...CONTEXT_MENU_DEFAULT_OPTIONS, ...options });
    this.assignParentMenuRefsContextMenu(this, null);
  }

  public override executableClick(item: MenuItem) {
    super.executableClick(item);
    this.subMenuComponent?.closeContextMenuWithResult(item);
  }

  private assignParentMenuRefsContextMenu(
    menu: PopupMenu,
    parentMenu: Menu | null
  ) {
    if (parentMenu) {
      (menu as SubMenu).parentMenu = parentMenu;
    }
    for (const group of menu.menuItemGroups) {
      for (const item of group.items) {
        if ((item as ExpandableItem).subMenu) {
          this.assignParentMenuRefsContextMenu(
            (item as SubMenuItem).subMenu,
            menu
          );
        }
      }
    }
  }
}
