/* eslint-disable @typescript-eslint/no-explicit-any */
import { Actor, createActor } from 'xstate5';
import { SubMenuComponent } from '../../menu-components/sub-menu/sub-menu.component';
import { PopupMenuConfig } from '../../types/menu-config.types';
import { MenuOptionsProps } from '../../types/menu-options.types';
import { MenuItem, MenuItemGroup } from '../menu-item-classes';
import { Menu } from './menu';
import { popupMenuMachine } from './xstate5/popup-menu.machine';

export abstract class PopupMenu extends Menu {
  public menuItemGroups: MenuItemGroup[];

  public subMenuComponent: SubMenuComponent | null;

  private popupMenuMachineActor: Actor<typeof popupMenuMachine> | undefined;

  constructor(config: PopupMenuConfig, options: MenuOptionsProps) {
    super(config, options);
    this.menuItemGroups = config.menuItemGroups ?? [];
    this.initialiseMenuItems();
    this.subMenuComponent = null;
  }

  public startStateMachine() {
    if (this.popupMenuMachineActor) {
      this.popupMenuMachineActor.stop();
    }
    this.popupMenuMachineActor = createActor(popupMenuMachine, {
      input: this,
    });
    // this.xstateService.onTransition((state) => {
    //   let initial = true;
    //   if (state.changed || initial) {
    //     initial = false;
    //   }
    // });
    this.popupMenuMachineActor.start();
  }

  public stopStateMachine() {
    if (this.popupMenuMachineActor) {
      this.popupMenuMachineActor.stop();
      this.popupMenuMachineActor = undefined;
    }
  }

  public backdropClick() {
    if (this.popupMenuMachineActor) {
      this.popupMenuMachineActor.send({ type: 'backdrop.click' });
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public override executableClick(item: MenuItem) {
    if (this.popupMenuMachineActor) {
      this.popupMenuMachineActor.send({ type: 'command.execute' });
    }
  }

  public enterItem(item: MenuItem) {
    if (this.popupMenuMachineActor) {
      this.popupMenuMachineActor.send({ type: 'item.enter', item });
    }
  }

  public leaveItem() {
    if (this.popupMenuMachineActor) {
      this.popupMenuMachineActor.send({ type: 'item.leave' });
    }
  }

  public override overSubMenu() {
    if (this.popupMenuMachineActor) {
      this.popupMenuMachineActor.send({ type: 'mouse.overSubMenu' });
    }
  }

  protected initialiseMenuItems(): void {
    for (const group of this.menuItemGroups) {
      for (const item of group.items) {
        item.initialise(this);
      }
    }
  }
}
