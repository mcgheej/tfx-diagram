import { Store } from '@ngrx/store';
import { selectShowRulers } from '@tfx-diagram/diagram-data-access-store-features-settings';
import { ViewMenuActions } from '@tfx-diagram/diagram-data-access-store-actions';
import { CheckboxItem, MenuBuilderService } from '@tfx-diagram/shared-angular/ui/tfx-menu';
import { Hotkey, HotkeysService } from 'angular2-hotkeys';

// const HOTKEY = 'ctrl+alt+p';

export class ShowRulersCheckbox {
  private hotkey: Hotkey | null = null;

  private item = this.mb.checkboxItem({
    label: 'Show Rulers',
    subLabel: 'Ctrl+Alt+Q',
    checked$: this.store.select(selectShowRulers),
    exec: this.toggleShowRulers(),
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
    this.hotkey = new Hotkey('ctrl+alt+q', () => {
      this.toggleShowRulers()(this.item);
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

  private toggleShowRulers(): (checkboxItem: CheckboxItem) => void {
    return () => {
      this.store.dispatch(ViewMenuActions.showRulersToggle());
    };
  }
}
