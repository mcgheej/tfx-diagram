import { Store } from '@ngrx/store';
import { MenuBuilderService, SubMenuItem } from '@tfx-diagram/shared-angular/ui/tfx-menu';
import { HotkeysService } from 'angular2-hotkeys';
import { CoordsTypeCheckbox } from './commands/coords-type.checkbox';
import { ShowMousePositionCheckbox } from './commands/show-mouse-position.checkbox';

export class MousePositionSubMenu {
  private showMousePositionCheckbox = new ShowMousePositionCheckbox(
    this.mb,
    this.store,
    this.hotkeysService
  );
  private showPageCoordinatesCheckbox = new CoordsTypeCheckbox(
    this.mb,
    this.store,
    'Page Coordinates',
    'page'
  );
  private showViewportCoordinatesCheckbox = new CoordsTypeCheckbox(
    this.mb,
    this.store,
    'Viewport Coordinates',
    'viewport'
  );

  private mousePositionSubMenu: SubMenuItem = this.mb.subMenuItem({
    label: 'Mouse Position',
    subMenu: this.mb.subMenu({
      id: 'view-mouse-position-sub-menu',
      menuItemGroups: [
        this.mb.menuItemGroup([this.showMousePositionCheckbox.getItem()]),
        this.mb.menuItemGroup([
          this.showPageCoordinatesCheckbox.getItem(),
          this.showViewportCoordinatesCheckbox.getItem(),
        ]),
      ],
    }),
  });

  constructor(
    private mb: MenuBuilderService,
    private store: Store,
    private hotkeysService: HotkeysService
  ) {}

  getItem() {
    return this.mousePositionSubMenu;
  }

  cleanup() {
    this.showMousePositionCheckbox.cleanup();
    this.showPageCoordinatesCheckbox.cleanup();
    this.showViewportCoordinatesCheckbox.cleanup();
  }
}
