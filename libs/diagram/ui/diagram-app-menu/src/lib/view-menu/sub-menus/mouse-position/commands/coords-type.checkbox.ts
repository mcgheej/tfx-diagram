import { Store } from '@ngrx/store';
import { ViewMenuActions } from '@tfx-diagram/diagram-data-access-store-actions';
import { selectMousePositionCoordsType } from '@tfx-diagram/diagram-data-access-store-features-settings';
import { MousePositionCoordsType } from '@tfx-diagram/electron-renderer-web/shared-types';
import { CheckboxItem, MenuBuilderService } from '@tfx-diagram/shared-angular/ui/tfx-menu';
import { map } from 'rxjs';

export class CoordsTypeCheckbox {
  item = this.mb.checkboxItem({
    label: this.label,
    checked$: this.store
      .select(selectMousePositionCoordsType)
      .pipe(map((value) => value === this.coordsType)),
    exec: this.setCoordsType(this.coordsType),
  });

  constructor(
    private mb: MenuBuilderService,
    private store: Store,
    private label: string,
    private coordsType: MousePositionCoordsType
  ) {
    // super(store);
  }

  getItem(): CheckboxItem {
    return this.item;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  cleanup() {}

  private setCoordsType(value: MousePositionCoordsType): (checkboxItem: CheckboxItem) => void {
    return () => {
      this.store.dispatch(ViewMenuActions.mousePositionCoordsTypeChange({ value }));
    };
  }
}
