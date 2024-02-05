import { Store } from '@ngrx/store';
import { Alignment } from '@tfx-diagram/electron-renderer-web/shared-types';
import { CheckboxItem, MenuBuilderService } from '@tfx-diagram/shared-angular/ui/tfx-menu';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PageAlignBase } from './page-align-base';

export class HorizPageAlignCentreCheckbox extends PageAlignBase {
  private item = this.mb.checkboxItem({
    label: 'Horizontal Centre',
    checked$: this.pageAlignment$.pipe(map((value) => value.horizontal === 'center')),
    exec: this.setPageAlignment({ horizontal: 'center' }),
  });

  constructor(
    private mb: MenuBuilderService,
    private pageAlignment$: Observable<Alignment>,
    store: Store
  ) {
    super(store);
  }

  getItem(): CheckboxItem {
    return this.item;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  cleanup() {}
}
