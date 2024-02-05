import { Store } from '@ngrx/store';
import { EditMenuActions } from '@tfx-diagram/diagram-data-access-store-actions';
import {
  selectSelectedShapeIds,
  selectTextEdit,
} from '@tfx-diagram/diagram/data-access/store/features/control-frame';
import { TextEdit } from '@tfx-diagram/diagram/data-access/text-classes';
import { CommandItem, MenuBuilderService } from '@tfx-diagram/shared-angular/ui/tfx-menu';
import { Hotkey, HotkeysService } from 'angular2-hotkeys';
import { combineLatest, map, Subscription } from 'rxjs';

export class CopyCommand {
  private hotkey: Hotkey | null = null;

  private disableCopyCmd$ = combineLatest([
    this.store.select(selectSelectedShapeIds),
    this.store.select(selectTextEdit),
  ]).pipe(
    map(([ids, textEdit]) => {
      return ids.length === 0 || textEdit !== null;
    })
  );

  private item = this.mb.commandItem({
    label: 'Copy',
    subLabel: 'Ctrl+C',
    disabled$: this.disableCopyCmd$,
    exec: this.doCopy(),
  });

  private selectedShapeIds: string[] = [];
  private textEdit: TextEdit | null = null;
  private subscription: Subscription | null = null;

  constructor(
    private mb: MenuBuilderService,
    private store: Store,
    private hotkeysService: HotkeysService
  ) {
    this.subscription = combineLatest([
      this.store.select(selectSelectedShapeIds),
      this.store.select(selectTextEdit),
    ]).subscribe(([ids, tEdit]) => {
      this.selectedShapeIds = ids;
      this.textEdit = tEdit;
    });
  }

  getItem(): CommandItem {
    if (this.hotkey) {
      this.hotkeysService.remove(this.hotkey);
    }
    this.hotkey = new Hotkey('ctrl+c', () => {
      if (this.selectedShapeIds.length > 0 && this.textEdit === null) {
        this.doCopy()(this.item);
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

  private doCopy(): (commandItem: CommandItem) => void {
    return () => {
      this.store.dispatch(
        EditMenuActions.copyClick({
          selectedShapeIds: this.selectedShapeIds,
          textEdit: this.textEdit,
        })
      );
    };
  }
}
