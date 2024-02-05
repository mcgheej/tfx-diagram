import { Store } from '@ngrx/store';
import { selectPageAlignmentInViewport } from '@tfx-diagram/diagram-data-access-store-features-settings';
import { MenuBuilderService, SubMenuItem } from '@tfx-diagram/shared-angular/ui/tfx-menu';
import { HorizPageAlignCentreCheckbox } from './commands/horiz-page-align-centre.checkbox';
import { HorizPageAlignLeftCheckbox } from './commands/horiz-page-align-left.checkbox';
import { HorizPageAlignRightCheckbox } from './commands/horiz-page-align-right.checkbox';
import { VertPageAlignBottomCheckbox } from './commands/vert-page-align-bottom.checkbox';
import { VertPageAlignCentreCheckbox } from './commands/vert-page-align-centre.checkbox';
import { VertPageAlignTopCheckbox } from './commands/vert-page-align-top.checkbox';

export class PageAlignSubMenu {
  pageAlignment$ = this.store.select(selectPageAlignmentInViewport);

  private horizPageAlignLeftCheckbox = new HorizPageAlignLeftCheckbox(
    this.mb,
    this.pageAlignment$,
    this.store
  );
  private horizPageAlignCentreCheckbox = new HorizPageAlignCentreCheckbox(
    this.mb,
    this.pageAlignment$,
    this.store
  );
  private horizPageAlignRightCheckbox = new HorizPageAlignRightCheckbox(
    this.mb,
    this.pageAlignment$,
    this.store
  );
  private vertPageAlignTopCheckbox = new VertPageAlignTopCheckbox(
    this.mb,
    this.pageAlignment$,
    this.store
  );
  private vertPageAlignCentreCheckbox = new VertPageAlignCentreCheckbox(
    this.mb,
    this.pageAlignment$,
    this.store
  );
  private vertPageAlignBottomCheckbox = new VertPageAlignBottomCheckbox(
    this.mb,
    this.pageAlignment$,
    this.store
  );

  private pageAlignSubMenu: SubMenuItem = this.mb.subMenuItem({
    label: 'Page Alignment',
    subMenu: this.mb.subMenu({
      id: 'view-page-alignment-sub-menu',
      menuItemGroups: [
        this.mb.menuItemGroup([
          this.horizPageAlignLeftCheckbox.getItem(),
          this.horizPageAlignCentreCheckbox.getItem(),
          this.horizPageAlignRightCheckbox.getItem(),
        ]),
        this.mb.menuItemGroup([
          this.vertPageAlignTopCheckbox.getItem(),
          this.vertPageAlignCentreCheckbox.getItem(),
          this.vertPageAlignBottomCheckbox.getItem(),
        ]),
      ],
    }),
  });

  constructor(private mb: MenuBuilderService, private store: Store) {}

  getItem(): SubMenuItem {
    return this.pageAlignSubMenu;
  }

  cleanup() {
    this.horizPageAlignLeftCheckbox.cleanup();
    this.horizPageAlignCentreCheckbox.cleanup();
    this.horizPageAlignRightCheckbox.cleanup();
    this.vertPageAlignTopCheckbox.cleanup();
    this.vertPageAlignCentreCheckbox.cleanup();
    this.vertPageAlignBottomCheckbox.cleanup();
  }
}
