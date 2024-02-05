import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppMenuItemComponent } from '../../menu-item-components/app-menu-item/app-menu-item.component';
import { AppMenuItemConfig } from '../../types';
import { AppMenu, Menu } from '../menu-classes';
import { ExpandableItem } from './expandable-item';

export interface AppMenuItemVM {
  color: string;
  backgroundColor: string;
  visible: boolean;
}

export class AppMenuItem extends ExpandableItem {
  public vm$!: Observable<AppMenuItemVM>;
  public component: AppMenuItemComponent | null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(config: AppMenuItemConfig, componentType: any) {
    config.type = 'appMenuItem';
    super(config);
    this.componentType = componentType;
    this.component = null;
  }

  public override initialise(hostMenu: Menu) {
    super.initialise(hostMenu);
    this.vm$ = combineLatest([
      this.disabled$,
      this.visible$,
      this.hostMenu.activeItemId$,
    ]).pipe(
      map((result) => {
        return {
          color: result[0]
            ? this.hostMenu.options.disabledItemTextColor
            : this.hostMenu.options.itemTextColor,
          backgroundColor:
            result[2] === this.id
              ? this.hostMenu.options.itemHighlightColor
              : this.hostMenu.options.itemBackgroundColor,
          visible: result[1],
        };
      })
    );
  }

  public click() {
    (this.hostMenu as AppMenu).clickItem(this);
  }

  public mouseEnter() {
    (this.hostMenu as AppMenu).enterItem(this);
  }

  public mouseLeave() {
    (this.hostMenu as AppMenu).leaveItem();
  }
}
