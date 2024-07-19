import { Store } from '@ngrx/store';
import { EditMenuActions } from '@tfx-diagram/diagram-data-access-store-actions';
import { redoDisabled$ } from '@tfx-diagram/diagram-data-access-store-undo-redo';
import { CommandItem, MenuBuilderService } from '@tfx-diagram/shared-angular/ui/tfx-menu';
import { Hotkey, HotkeysService } from 'angular2-hotkeys';

export class RedoCommand {
  private hotkey: Hotkey | null = null;

  private item = this.mb.commandItem({
    label: 'Redo',
    subLabel: 'Ctrl+Y',
    disabled$: redoDisabled$,
    exec: this.doRedo(),
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
    this.hotkey = new Hotkey('ctrl+y', () => {
      this.doRedo()(this.item);
      return false;
    });
    this.hotkeysService.add(this.hotkey);

    return this.item;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  cleanup() {}

  private doRedo(): (commandItem: CommandItem) => void {
    return () => {
      this.store.dispatch(EditMenuActions.redoClick());
    };
  }
}
