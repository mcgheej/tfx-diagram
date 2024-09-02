import { Store } from '@ngrx/store';
import { EditMenuActions } from '@tfx-diagram/diagram-data-access-store-actions';
import {
  selectSelectedShapeIds,
  selectTextEdit,
} from '@tfx-diagram/diagram/data-access/store/features/control-frame';
import { CommandItem, MenuBuilderService } from '@tfx-diagram/shared-angular/ui/tfx-menu';
import { Hotkey, HotkeysService } from 'angular2-hotkeys';
import { combineLatest, map, take } from 'rxjs';

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

  constructor(
    private mb: MenuBuilderService,
    private store: Store,
    private hotkeysService: HotkeysService
  ) {}

  getItem(): CommandItem {
    if (this.hotkey) {
      this.hotkeysService.remove(this.hotkey);
    }
    this.hotkey = new Hotkey('ctrl+c', () => {
      this.doCopy()(this.item);
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

  private doCopy(): (commandItem: CommandItem) => void {
    return () => {
      combineLatest([
        this.store.select(selectSelectedShapeIds),
        this.store.select(selectTextEdit),
      ])
        .pipe(take(1))
        .subscribe(([selectedShapeIds, textEdit]) => {
          if (selectedShapeIds.length > 0 && textEdit === null) {
            this.store.dispatch(
              EditMenuActions.copyClick({
                selectedShapeIds,
                textEdit,
              })
            );
          }
        });
    };
  }
}
