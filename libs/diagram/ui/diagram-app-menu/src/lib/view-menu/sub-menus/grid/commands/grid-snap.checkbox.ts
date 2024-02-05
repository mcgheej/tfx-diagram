import { Store } from '@ngrx/store';
import { ViewMenuActions } from '@tfx-diagram/diagram-data-access-store-actions';
import { selectGridSnap } from '@tfx-diagram/diagram-data-access-store-features-settings';
import { CheckboxItem, MenuBuilderService } from '@tfx-diagram/shared-angular/ui/tfx-menu';

// const HOTKEY = 'ctrl+alt+p';

export class GridSnapCheckbox {
  private item = this.mb.checkboxItem({
    label: 'Snap to Grid',
    checked$: this.store.select(selectGridSnap),
    exec: this.toggleGridSnap(),
  });

  constructor(private mb: MenuBuilderService, private store: Store) {}

  getItem(): CheckboxItem {
    return this.item;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  cleanup() {}

  private toggleGridSnap(): (checkboxItem: CheckboxItem) => void {
    return () => {
      this.store.dispatch(ViewMenuActions.snapToGridToggle());
    };
  }
}
