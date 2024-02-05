import { Store } from '@ngrx/store';
import { EditMenuActions } from '@tfx-diagram/diagram-data-access-store-actions';
import { selectTextEdit } from '@tfx-diagram/diagram/data-access/store/features/control-frame';
import { selectCopyBuffer } from '@tfx-diagram/diagram/data-access/store/features/shapes';
import { TextEdit } from '@tfx-diagram/diagram/data-access/text-classes';
import { CommandItem, MenuBuilderService } from '@tfx-diagram/shared-angular/ui/tfx-menu';
import { Hotkey, HotkeysService } from 'angular2-hotkeys';
import { combineLatest, map, Subscription } from 'rxjs';

export class PasteCommand {
  private hotkey: Hotkey | null = null;

  // private disablePasteCmd$ = this.store.select(selectCopyBuffer).pipe(
  //   map((copyBuffer) => {
  //     return copyBuffer.length === 0;
  //   })
  // );

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

  private copyBufferLength = 0;
  private textEdit: TextEdit | null = null;
  private subscription: Subscription | null = null;

  constructor(
    private mb: MenuBuilderService,
    private store: Store,
    private hotkeysService: HotkeysService
  ) {
    this.subscription = combineLatest([
      this.store.select(selectCopyBuffer),
      this.store.select(selectTextEdit),
    ]).subscribe(([copyBuffer, tEdit]) => {
      this.copyBufferLength = copyBuffer.length;
      this.textEdit = tEdit;
    });
  }

  getItem(): CommandItem {
    if (this.hotkey) {
      this.hotkeysService.remove(this.hotkey);
    }
    this.hotkey = new Hotkey('ctrl+v', () => {
      if (this.copyBufferLength > 0 && this.textEdit === null) {
        this.doPaste()(this.item);
      }
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
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  private doPaste(): (commandItem: CommandItem) => void {
    return () => {
      this.store.dispatch(EditMenuActions.pasteClick({ textEdit: this.textEdit }));
    };
  }
}
