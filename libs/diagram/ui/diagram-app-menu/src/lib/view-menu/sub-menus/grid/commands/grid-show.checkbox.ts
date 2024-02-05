import { Store } from '@ngrx/store';
import { selectGridShow } from '@tfx-diagram/diagram-data-access-store-features-settings';
import { ViewMenuActions } from '@tfx-diagram/diagram-data-access-store-actions';
import { CheckboxItem, MenuBuilderService } from '@tfx-diagram/shared-angular/ui/tfx-menu';
import { Hotkey, HotkeysService } from 'angular2-hotkeys';

export class GridShowCheckbox {
  private hotkey: Hotkey | null = null;

  private item = this.mb.checkboxItem({
    label: 'Show Grid',
    subLabel: 'Ctrl+Alt+G',
    checked$: this.store.select(selectGridShow),
    exec: this.toggleGridShow(),
  });

  constructor(
    private mb: MenuBuilderService,
    private store: Store,
    private hotkeysService: HotkeysService
  ) {}

  getItem(): CheckboxItem {
    if (this.hotkey) {
      this.hotkeysService.remove(this.hotkey);
    }
    this.hotkey = new Hotkey('ctrl+alt+g', () => {
      this.toggleGridShow()(this.item);
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

  private toggleGridShow(): (checkboxItem: CheckboxItem) => void {
    return () => {
      this.store.dispatch(ViewMenuActions.showGridToggle());
    };
  }
}
