import { Store } from '@ngrx/store';
import { AVAILABLE_SCREEN_PIXEL_DENSITIES } from '@tfx-diagram/electron-renderer-web/shared-types';
import {
  CheckboxItem,
  MenuBuilderService,
  SubMenuItem,
} from '@tfx-diagram/shared-angular/ui/tfx-menu';
import { DensityCheckbox } from './density.checkbox';

export class ScreenPixelDensitySubMenu {
  private densityCheckboxes: DensityCheckbox[] = this.getDensityCheckboxes();

  private gridSubMenu: SubMenuItem = this.mb.subMenuItem({
    label: 'Screen Pixel Density',
    subMenu: this.mb.subMenu({
      id: 'view-screen-pixel-density-sub-menu',
      menuItemGroups: [this.mb.menuItemGroup(this.getCheckboxItems())],
    }),
  });

  constructor(private mb: MenuBuilderService, private store: Store) {}

  getItem(): SubMenuItem {
    return this.gridSubMenu;
  }

  cleanup() {
    for (const densityCheckbox of this.densityCheckboxes) {
      densityCheckbox.cleanup();
    }
  }

  private getDensityCheckboxes(): DensityCheckbox[] {
    const result: DensityCheckbox[] = [];
    for (const density of AVAILABLE_SCREEN_PIXEL_DENSITIES) {
      result.push(new DensityCheckbox(this.mb, this.store, density));
    }
    return result;
  }

  private getCheckboxItems(): CheckboxItem[] {
    const result: CheckboxItem[] = [];
    for (const densityCheckbox of this.densityCheckboxes) {
      result.push(densityCheckbox.getItem());
    }
    return result;
  }
}
