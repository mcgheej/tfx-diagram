import { ExpandableItemConfig } from '../../types';
import { SubMenu } from '../menu-classes/sub-menu';
import { MenuItem } from './menu-item';

export abstract class ExpandableItem extends MenuItem {
  public subMenu!: SubMenu;

  constructor(config: ExpandableItemConfig) {
    super(config);
    this.subMenu = config.subMenu;
  }
}
