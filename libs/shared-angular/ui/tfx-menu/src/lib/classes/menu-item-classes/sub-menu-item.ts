import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SubMenuItemComponent } from '../../menu-item-components/sub-menu-item/sub-menu-item.component';
import { SubMenuItemConfig } from '../../types';
import { Menu, PopupMenu } from '../menu-classes';
import { ExpandableItem } from './expandable-item';

export interface SubMenuItemVM {
  color: string;
  backgroundColor: string;
  cursor: string;
  visible: boolean;
}

export class SubMenuItem extends ExpandableItem {
  public vm$!: Observable<SubMenuItemVM>;
  public component: SubMenuItemComponent | null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(config: SubMenuItemConfig, componentType: any) {
    config.type = 'subMenuItem';
    super(config);
    this.componentType = componentType;
    this.component = null;
  }

  public override initialise(hostMenu: Menu) {
    super.initialise(hostMenu);
    this.vm$ = combineLatest([this.disabled$, this.visible$, this.hostMenu.activeItemId$]).pipe(
      map(([disabled, visible, activeItemId]) => {
        return {
          color: disabled
            ? this.hostMenu.options.disabledItemTextColor
            : this.hostMenu.options.itemTextColor,
          backgroundColor:
            activeItemId === this.id && !disabled
              ? this.hostMenu.options.itemHighlightColor
              : this.hostMenu.options.itemBackgroundColor,
          cursor: disabled ? 'default' : 'pointer',
          visible: visible,
        };
      })
    );
  }

  public mouseEnter() {
    (this.hostMenu as PopupMenu).enterItem(this);
  }

  public mouseLeave() {
    (this.hostMenu as PopupMenu).leaveItem();
  }
}
