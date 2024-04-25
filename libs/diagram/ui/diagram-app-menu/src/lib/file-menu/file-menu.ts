import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { SaveCloseMachineService } from '@tfx-diagram/diagram/ui/file-save-close-xstate';
import {
  AppMenuItem,
  MenuBuilderService,
  MenuItemGroup,
} from '@tfx-diagram/shared-angular/ui/tfx-menu';
import { Subject } from 'rxjs';
import { CloseCommand, ExitCommand, NewCommand, OpenCommand, SaveCommand } from './commands';
import { ExportCommand } from './commands/export.command';

export class FileMenu {
  private newSketchbook = new NewCommand(
    this.mb,
    this.store,
    this.dialog,
    this.saveCloseMachine
  );
  private openSketchbook = new OpenCommand(this.mb, this.store, this.saveCloseMachine);
  private saveSketchbook = new SaveCommand(this.mb, this.store);
  private closeSketchbook = new CloseCommand(this.mb, this.store, this.saveCloseMachine);
  private exportSketchbook = new ExportCommand(this.mb, this.store);
  private exitApp = new ExitCommand(this.mb, this.cmdsSubject$, this.saveCloseMachine);

  private fileMenuItem: AppMenuItem = this.mb.appMenuItem({
    label: 'File',
    subMenu: this.mb.subMenu({
      id: 'file-sub-menu',
      menuItemGroups: this.getMenuItemGroups(),
    }),
  });

  constructor(
    private mb: MenuBuilderService,
    private store: Store,
    private dialog: MatDialog,
    private environmentElectron: boolean,
    private cmdsSubject$: Subject<string>,
    private saveCloseMachine: SaveCloseMachineService
  ) {}

  getItem(): AppMenuItem {
    return this.fileMenuItem;
  }

  cleanup() {
    this.newSketchbook.cleanup();
    this.openSketchbook.cleanup();
    this.saveSketchbook.cleanup();
    this.closeSketchbook.cleanup();
    this.exportSketchbook.cleanup();
    this.exitApp.cleanup();
  }

  private getMenuItemGroups(): MenuItemGroup[] {
    const menuGroups: MenuItemGroup[] = this.environmentElectron
      ? [
          this.mb.menuItemGroup([
            this.newSketchbook.getItem(),
            this.openSketchbook.getItem(),
            this.saveSketchbook.getItem(),
            this.closeSketchbook.getItem(),
          ]),
          this.mb.menuItemGroup([this.exportSketchbook.getItem()]),
          this.mb.menuItemGroup([this.exitApp.getItem()]),
        ]
      : [
          this.mb.menuItemGroup([
            this.newSketchbook.getItem(),
            this.openSketchbook.getItem(),
            this.saveSketchbook.getItem(),
            this.closeSketchbook.getItem(),
          ]),
          this.mb.menuItemGroup([this.exportSketchbook.getItem()]),
        ];
    return menuGroups;
  }
}
