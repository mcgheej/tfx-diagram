import { Store } from '@ngrx/store';
import { ViewMenuActions } from '@tfx-diagram/diagram-data-access-store-actions';
import { selectShowShapeInspector } from '@tfx-diagram/diagram-data-access-store-features-settings';
import { CheckboxItem, MenuBuilderService } from '@tfx-diagram/shared-angular/ui/tfx-menu';

export class ShowShapeInspectorCheckbox {
  private item = this.mb.checkboxItem({
    label: 'Show Shape Inspector',
    checked$: this.store.select(selectShowShapeInspector),
    exec: this.toggleShowShapeInspector(),
  });

  constructor(private mb: MenuBuilderService, private store: Store) {}

  getItem(): CheckboxItem {
    return this.item;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  cleanup() {}

  private toggleShowShapeInspector(): (checkboxItem: CheckboxItem) => void {
    return () => {
      this.store.dispatch(ViewMenuActions.showShapeInspectorToggle());
    };
  }
}
