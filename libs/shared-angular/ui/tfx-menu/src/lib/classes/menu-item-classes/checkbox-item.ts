import { combineLatest, from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DEFAULT_CHECKBOX_ITEM_VALUE } from '../../defaults';
import { CheckboxItemConfig } from '../../types';
import { Menu, PopupMenu } from '../menu-classes';
import { MenuItem } from './menu-item';

export interface CheckboxItemVM {
  color: string;
  backgroundColor: string;
  cursor: string;
  checked: boolean;
  visible: boolean;
}

export class CheckboxItem extends MenuItem {
  public checked$: Observable<boolean>;
  public subLabel: string;
  public exec: ((cmd: CheckboxItem) => void) | null;
  public vm$!: Observable<CheckboxItemVM>;

  private disabled: boolean;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(config: CheckboxItemConfig, componentType: any) {
    config.type = 'checkboxItem';
    super(config);
    this.componentType = componentType;
    this.checked$ = config.checked$ ?? from([DEFAULT_CHECKBOX_ITEM_VALUE]);
    this.subLabel = config.subLabel ?? '';
    this.exec = config.exec ?? null;
    this.disabled = false;
  }

  public override initialise(hostMenu: Menu) {
    super.initialise(hostMenu);
    this.vm$ = combineLatest([
      this.disabled$,
      this.visible$,
      this.checked$,
      this.hostMenu.activeItemId$,
    ]).pipe(
      map(([disabled, visible, checked, activeItemId]) => {
        return {
          color: disabled
            ? this.hostMenu.options.disabledItemTextColor
            : this.hostMenu.options.itemTextColor,
          backgroundColor:
            activeItemId === this.id && !disabled
              ? this.hostMenu.options.itemHighlightColor
              : this.hostMenu.options.itemBackgroundColor,
          cursor: disabled ? 'default' : 'pointer',
          checked: checked,
          visible: visible,
        };
      })
    );
  }

  public click() {
    if (!this.disabled) {
      this.hostMenu.executableClick(this);
      if (this.exec) {
        this.exec(this);
      }
    }
  }

  public mouseEnter() {
    (this.hostMenu as PopupMenu).enterItem(this);
  }

  public mouseLeave() {
    (this.hostMenu as PopupMenu).leaveItem();
  }
}
