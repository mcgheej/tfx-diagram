import { Store } from '@ngrx/store';
import { ViewMenuActions } from '@tfx-diagram/diagram-data-access-store-actions';
import { MousePositionCoordsType } from '@tfx-diagram/electron-renderer-web/shared-types';
import { CheckboxItem } from '@tfx-diagram/shared-angular/ui/tfx-menu';

export abstract class CoordsTypeBase {
  constructor(protected store: Store) {}

  protected setCoordsType(
    value: MousePositionCoordsType
  ): (checkboxItem: CheckboxItem) => void {
    return () => {
      this.store.dispatch(ViewMenuActions.mousePositionCoordsTypeChange({ value }));
    };
  }
}
