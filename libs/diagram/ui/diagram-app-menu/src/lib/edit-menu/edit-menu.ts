import { Store } from '@ngrx/store';
import { selectStatus } from '@tfx-diagram/diagram-data-access-store-features-sketchbook';
import {
  AppMenuItem,
  MenuBuilderService,
  MenuItemGroup,
} from '@tfx-diagram/shared-angular/ui/tfx-menu';
import { HotkeysService } from 'angular2-hotkeys';
import { map } from 'rxjs';
import { CopyCommand } from './commands/copy.command';
import { CutCommand } from './commands/cut.command';
import { DeleteCommand } from './commands/delete.command';
import { DuplicateSelectionCommand } from './commands/duplicate.command';
import { PasteCommand } from './commands/paste.command';
import { RedoCommand } from './commands/redo.command';
import { UndoCommand } from './commands/undo.command';

export class EditMenu {
  private undoCmd = new UndoCommand(this.mb, this.store, this.hotkeysService);
  private redoCmd = new RedoCommand(this.mb, this.store, this.hotkeysService);
  private cutCmd = new CutCommand(this.mb, this.store, this.hotkeysService);
  private copyCmd = new CopyCommand(this.mb, this.store, this.hotkeysService);
  private pasteCmd = new PasteCommand(this.mb, this.store, this.hotkeysService);
  private duplicateCmd = new DuplicateSelectionCommand(
    this.mb,
    this.store,
    this.hotkeysService
  );
  private deleteCmd = new DeleteCommand(this.mb, this.store, this.hotkeysService);

  private editMenuItem: AppMenuItem = this.mb.appMenuItem({
    label: 'Edit',
    visible$: this.store.select(selectStatus).pipe(map((status) => status !== 'closed')),
    subMenu: this.mb.subMenu({
      id: 'edit-sub-menu',
      menuItemGroups: this.getMenuItemGroups(),
    }),
  });

  constructor(
    private mb: MenuBuilderService,
    private store: Store,
    private hotkeysService: HotkeysService
  ) {}

  getItem(): AppMenuItem {
    return this.editMenuItem;
  }

  cleanup() {
    this.undoCmd.cleanup();
    this.redoCmd.cleanup();
    this.cutCmd.cleanup();
    this.copyCmd.cleanup();
    this.pasteCmd.cleanup();
    this.duplicateCmd.cleanup();
    this.deleteCmd.cleanup();
  }

  private getMenuItemGroups(): MenuItemGroup[] {
    return [
      this.mb.menuItemGroup([
        this.cutCmd.getItem(),
        this.copyCmd.getItem(),
        this.pasteCmd.getItem(),
        this.duplicateCmd.getItem(),
      ]),
      this.mb.menuItemGroup([this.deleteCmd.getItem()]),
      this.mb.menuItemGroup([this.undoCmd.getItem(), this.redoCmd.getItem()]),
    ];
  }
}
