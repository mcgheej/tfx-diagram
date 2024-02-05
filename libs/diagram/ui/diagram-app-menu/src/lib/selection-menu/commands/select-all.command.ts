import { Store } from '@ngrx/store';
import { SelectionMenuActions } from '@tfx-diagram/diagram-data-access-store-actions';
import { selectShapes } from '@tfx-diagram/diagram/data-access/store/features/shapes';
import { CommandItem, MenuBuilderService } from '@tfx-diagram/shared-angular/ui/tfx-menu';
import { Hotkey, HotkeysService } from 'angular2-hotkeys';
import { map } from 'rxjs';

export class SelectAllCommand {
  private hotkey: Hotkey | null = null;

  private item = this.mb.commandItem({
    label: 'Select All',
    subLabel: 'Ctrl+A',
    disabled$: this.store.select(selectShapes).pipe(map((shapes) => shapes.size === 0)),
    exec: this.doSelectAll(),
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
    this.hotkey = new Hotkey('ctrl+a', () => {
      this.doSelectAll()(this.item);
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

  private doSelectAll(): (commandItem: CommandItem) => void {
    return () => {
      this.store.dispatch(SelectionMenuActions.selectAllClick());
    };
  }
}
