import { Store } from '@ngrx/store';
import { ViewMenuActions } from '@tfx-diagram/diagram-data-access-store-actions';
import { Alignment } from '@tfx-diagram/electron-renderer-web/shared-types';
import { CheckboxItem } from '@tfx-diagram/shared-angular/ui/tfx-menu';

export abstract class PageAlignBase {
  constructor(protected store: Store) {}

  protected setPageAlignment(value: Partial<Alignment>): (checkboxItem: CheckboxItem) => void {
    return () => {
      this.store.dispatch(ViewMenuActions.pageAlignmentChange({ value }));
    };
  }
}
