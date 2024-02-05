import { Store } from '@ngrx/store';
import { ViewMenuActions } from '@tfx-diagram/diagram-data-access-store-actions';
import { selectShapeSnap } from '@tfx-diagram/diagram-data-access-store-features-settings';
import { CheckboxItem, MenuBuilderService } from '@tfx-diagram/shared-angular/ui/tfx-menu';

export class ShapeSnapCheckbox {
  private item = this.mb.checkboxItem({
    label: 'Snap to Shape',
    checked$: this.store.select(selectShapeSnap),
    exec: this.toggleShapeSnap(),
  });

  constructor(private mb: MenuBuilderService, private store: Store) {}

  getItem(): CheckboxItem {
    return this.item;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  cleanup() {}

  private toggleShapeSnap(): (checkboxItem: CheckboxItem) => void {
    return () => {
      this.store.dispatch(ViewMenuActions.shapeSnapToggle());
    };
  }
}
