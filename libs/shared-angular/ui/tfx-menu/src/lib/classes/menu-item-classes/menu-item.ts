import { nanoid } from 'nanoid';
import { from, Observable } from 'rxjs';
import { MenuItemCategory, MenuItemConfig } from '../../types';
import { Menu } from '../menu-classes';

export abstract class MenuItem {
  public id: string;
  public type: MenuItemCategory;
  public label: string;
  public disabled$: Observable<boolean>;
  public visible$: Observable<boolean>;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public componentType: any;
  public hostMenu!: Menu;

  constructor(config: MenuItemConfig) {
    this.id = config.id ?? nanoid();
    this.type = config.type ?? 'appMenuItem';
    this.label = config.label ?? 'not set';
    this.disabled$ = config.disabled$ ?? from([false]);
    this.visible$ = config.visible$ ?? from([true]);
  }

  /**
   * Method called by the host menu to complete initialisation
   * of the menu item object. This involves setting the hostMenu
   * reference and initialising the menu view model observable
   * that is used in the various concrete menu classes.
   */
  public initialise(hostMenu: Menu) {
    this.hostMenu = hostMenu;
  }
}
