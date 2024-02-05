import { Store } from '@ngrx/store';
import { selectShowMousePosition } from '@tfx-diagram/diagram-data-access-store-features-settings';
import { ViewMenuActions } from '@tfx-diagram/diagram-data-access-store-actions';
import { CheckboxItem, MenuBuilderService } from '@tfx-diagram/shared-angular/ui/tfx-menu';
import { Hotkey, HotkeysService } from 'angular2-hotkeys';

export class ShowMousePositionCheckbox {
  private hotkey: Hotkey | null = null;

  private item = this.mb.checkboxItem({
    label: 'Show Position',
    subLabel: 'Ctrl+Alt+P',
    checked$: this.store.select(selectShowMousePosition),
    exec: this.toggleShowPosition(),
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
    this.hotkey = new Hotkey('ctrl+alt+p', () => {
      this.toggleShowPosition()(this.item);
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

  private toggleShowPosition(): (checkboxItem: CheckboxItem) => void {
    return () => {
      this.store.dispatch(ViewMenuActions.showMousePositionToggle());
    };
  }
}
