/* eslint-disable @typescript-eslint/no-empty-function */
import { nanoid } from 'nanoid';
import { BehaviorSubject, Subject } from 'rxjs';
import { MenuCategory } from '../../types/menu-category.type';
import { MenuConfig } from '../../types/menu-config.types';
import { MenuOptionsProps } from '../../types/menu-options.types';
import { ExpandableItem } from '../menu-item-classes';
import { MenuItem } from '../menu-item-classes/menu-item';

export abstract class Menu {
  static readonly noActiveItem = 'No Active Item';

  public id: string;
  public type: MenuCategory;
  public options: MenuOptionsProps;

  public activeItem: MenuItem | null;
  public activeItemIdSubject$ = new BehaviorSubject<string>(Menu.noActiveItem);
  public activeItemId$ = this.activeItemIdSubject$.asObservable();

  public subMenuControlSubject$ = new Subject<ExpandableItem | null>();
  public subMenuControl$ = this.subMenuControlSubject$.asObservable();

  constructor(config: MenuConfig, options: MenuOptionsProps) {
    this.id = config.id ?? nanoid();
    this.type = config.type ?? 'appMenu';
    this.options = { ...options };
    this.activeItem = null;
  }

  public overSubMenu() {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public executableClick(item: MenuItem) {}

  protected abstract initialiseMenuItems(): void;
}
