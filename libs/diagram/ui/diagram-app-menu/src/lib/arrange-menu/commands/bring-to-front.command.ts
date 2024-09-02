import { Store } from '@ngrx/store';
import { ArrangeMenuActions } from '@tfx-diagram/diagram-data-access-store-actions';
import {
  selectNumberOfSelectedShapes,
  selectSelectedShapeIds,
} from '@tfx-diagram/diagram/data-access/store/features/control-frame';
import { CommandItem, MenuBuilderService } from '@tfx-diagram/shared-angular/ui/tfx-menu';
import { Hotkey, HotkeysService } from 'angular2-hotkeys';
import { map, take } from 'rxjs';

export class BringToFrontCommand {
  private hotkey: Hotkey | null = null;

  private item = this.mb.commandItem({
    label: 'Bring to Front',
    subLabel: 'Ctrl+Alt+]',
    disabled$: this.store.select(selectNumberOfSelectedShapes).pipe(map((n) => n === 0)),
    exec: this.doBringToFront(),
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
    this.hotkey = new Hotkey('ctrl+alt+]', () => {
      this.doBringToFront()(this.item);
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

  private doBringToFront(): (commandItem: CommandItem) => void {
    return () => {
      this.store
        .select(selectSelectedShapeIds)
        .pipe(take(1))
        .subscribe((selectedShapeIds) => {
          if (selectedShapeIds.length > 0) {
            this.store.dispatch(ArrangeMenuActions.bringToFrontClick({ selectedShapeIds }));
          }
        });
    };
  }
}
