import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CommandItemComponent } from '../../menu-item-components/command-item/command-item.component';
import { CommandItemConfig } from '../../types';
import { Menu, PopupMenu } from '../menu-classes';
import { MenuItem } from './menu-item';

export interface CommandItemVM {
  color: string;
  backgroundColor: string;
  cursor: string;
  visible: boolean;
  outlinedIcons: boolean;
}

export class CommandItem extends MenuItem {
  public icon: string;
  public subLabel: string;
  public exec!: ((cmd: CommandItem) => void) | null;
  public vm$!: Observable<CommandItemVM>;
  public component!: CommandItemComponent;

  private disabled: boolean;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(config: CommandItemConfig, componentType: any) {
    config.type = 'commandItem';
    super(config);
    this.componentType = componentType;
    this.icon = config.icon ?? '';
    this.subLabel = config.subLabel ?? '';
    this.exec = config.exec ?? null;
    this.disabled = false;
  }

  public override initialise(hostMenu: Menu) {
    super.initialise(hostMenu);
    this.vm$ = combineLatest([
      this.disabled$,
      this.visible$,
      this.hostMenu.activeItemId$,
    ]).pipe(
      map(([disabled, visible, activeItemId]) => {
        this.disabled = disabled;
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
          outlinedIcons: hostMenu.options.outlinedIcons,
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
