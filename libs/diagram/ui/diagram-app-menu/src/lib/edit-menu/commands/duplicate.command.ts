import { Store } from '@ngrx/store';
import { EditMenuActions } from '@tfx-diagram/diagram-data-access-store-actions';
import { selectSelectedShapeIds } from '@tfx-diagram/diagram/data-access/store/features/control-frame';
import { CommandItem, MenuBuilderService } from '@tfx-diagram/shared-angular/ui/tfx-menu';
import { Hotkey, HotkeysService } from 'angular2-hotkeys';
import { map, take } from 'rxjs';

export class DuplicateSelectionCommand {
  private hotkey: Hotkey | null = null;

  private disableDuplicateCmd$ = this.store.select(selectSelectedShapeIds).pipe(
    map((ids) => {
      return ids.length === 0;
    })
  );

  private item = this.mb.commandItem({
    label: 'Duplicate',
    subLabel: 'Ctrl+D',
    disabled$: this.disableDuplicateCmd$,
    exec: this.doDuplicate(),
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
    this.hotkey = new Hotkey('ctrl+d', () => {
      this.doDuplicate()(this.item);
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

  private doDuplicate(): (commandItem: CommandItem) => void {
    return () => {
      this.store
        .select(selectSelectedShapeIds)
        .pipe(take(1))
        .subscribe((selectedShapeIds) => {
          if (selectedShapeIds.length > 0) {
            this.store.dispatch(EditMenuActions.duplicateClick({ selectedShapeIds }));
          }
        });
    };
  }
}
