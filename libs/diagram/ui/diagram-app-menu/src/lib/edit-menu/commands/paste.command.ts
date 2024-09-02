import { Store } from '@ngrx/store';
import { EditMenuActions } from '@tfx-diagram/diagram-data-access-store-actions';
import { selectTextEdit } from '@tfx-diagram/diagram/data-access/store/features/control-frame';
import { selectCopyBuffer } from '@tfx-diagram/diagram/data-access/store/features/shapes';
import { CommandItem, MenuBuilderService } from '@tfx-diagram/shared-angular/ui/tfx-menu';
import { Hotkey, HotkeysService } from 'angular2-hotkeys';
import { combineLatest, map, take } from 'rxjs';

export class PasteCommand {
  private hotkey: Hotkey | null = null;

  private disablePasteCmd$ = combineLatest([
    this.store.select(selectCopyBuffer),
    this.store.select(selectTextEdit),
  ]).pipe(
    map(([copyBuffer, textEdit]) => {
      return copyBuffer.length === 0 || textEdit !== null;
    })
  );

  private item = this.mb.commandItem({
    label: 'Paste',
    subLabel: 'Ctrl+V',
    disabled$: this.disablePasteCmd$,
    exec: this.doPaste(),
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
    this.hotkey = new Hotkey('ctrl+v', () => {
      this.doPaste()(this.item);
      return false;
    });
    this.hotkeysService.add(this.hotkey);
    return this.item;
  }

  cleanup() {
    if (this.hotkey) {
      this.hotkeysService.remove(this.hotkey);
      this.hotkey = null;
    }
  }

  private doPaste(): (commandItem: CommandItem) => void {
    return () => {
      combineLatest([this.store.select(selectCopyBuffer), this.store.select(selectTextEdit)])
        .pipe(take(1))
        .subscribe(([copyBuffer, textEdit]) => {
          if (copyBuffer.length > 0 && textEdit === null)
            this.store.dispatch(EditMenuActions.pasteClick({ textEdit }));
        });
    };
  }
}
