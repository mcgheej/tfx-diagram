import { Store } from '@ngrx/store';
import { EditMenuActions } from '@tfx-diagram/diagram-data-access-store-actions';
import { undoDisabled$ } from '@tfx-diagram/diagram-data-access-store-undo-redo';
import { CommandItem, MenuBuilderService } from '@tfx-diagram/shared-angular/ui/tfx-menu';
import { Hotkey, HotkeysService } from 'angular2-hotkeys';

export class UndoCommand {
  private hotkey: Hotkey | null = null;

  private item = this.mb.commandItem({
    label: 'Undo',
    subLabel: 'Ctrl+Z',
    disabled$: undoDisabled$,
    exec: this.doUndo(),
  });

  constructor(
    private mb: MenuBuilderService,
    private store: Store,
    private hotkeysService: HotkeysService
  ) {}

  getItem(): CommandItem {
    if (this.hotkey) {
      this.hotkeysService.remove(this.hotkey);
    }
    this.hotkey = new Hotkey('ctrl+z', () => {
      this.doUndo()(this.item);
      return false;
    });
    this.hotkeysService.add(this.hotkey);

    return this.item;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  cleanup() {}

  private doUndo(): (commandItem: CommandItem) => void {
    return () => {
      this.store.dispatch(EditMenuActions.undoClick());
    };
  }
}
