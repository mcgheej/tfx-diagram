import { Store } from '@ngrx/store';
import { ViewMenuActions } from '@tfx-diagram/diagram-data-access-store-actions';
import { selectScreenPixelDensity } from '@tfx-diagram/diagram-data-access-store-features-settings';
import { CheckboxItem, MenuBuilderService } from '@tfx-diagram/shared-angular/ui/tfx-menu';
import { map } from 'rxjs';

export class DensityCheckbox {
  private item = this.mb.checkboxItem({
    label: `${this.density}ppi`,
    checked$: this.store
      .select(selectScreenPixelDensity)
      .pipe(map((density) => density === this.density)),
    exec: this.setDensity(),
  });

  constructor(private mb: MenuBuilderService, private store: Store, private density: number) {}

  getItem(): CheckboxItem {
    return this.item;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  cleanup() {}

  private setDensity(): (checkboxItem: CheckboxItem) => void {
    return () => {
      this.store.dispatch(ViewMenuActions.screenPixelDensityChange({ value: this.density }));
    };
  }
}
