// import { MenuBuilderService } from "@tfx-diagram/shared-angular/ui/tfx-menu";

import { Store } from '@ngrx/store';
import { selectStatus } from '@tfx-diagram/diagram-data-access-store-features-sketchbook';
import { ZoomControlService } from '@tfx-diagram/diagram/ui/zoom-control';
import { AppMenuItem, MenuBuilderService } from '@tfx-diagram/shared-angular/ui/tfx-menu';
import { HotkeysService } from 'angular2-hotkeys';
import { map } from 'rxjs';
import { ShapeSnapCheckbox } from './commands/shape-snap.checkbox';
import { ShowRulersCheckbox } from './commands/show-rulers.checkbox';
import { ShowShapeInspectorCheckbox } from './commands/show-shape-inspector.checkbox';
import { GridSubMenu } from './sub-menus/grid/grid.sub-menu';
import { MousePositionSubMenu } from './sub-menus/mouse-position/mouse-position.sub-menu';
import { PageAlignSubMenu } from './sub-menus/page-align/page-align.sub-menu';
import { ScreenPixelDensitySubMenu } from './sub-menus/screen-pixel-density/screen-pixel-density.sub-menu';
import { ZoomSubMenu } from './sub-menus/zoom/zoom.sub-menu';

export class ViewMenu {
  private showRulers = new ShowRulersCheckbox(this.mb, this.store, this.hotkeysService);
  private showShapeInspector = new ShowShapeInspectorCheckbox(this.mb, this.store);
  private shapeSnap = new ShapeSnapCheckbox(this.mb, this.store);
  private mousePositionSubMenu = new MousePositionSubMenu(
    this.mb,
    this.store,
    this.hotkeysService
  );
  private gridSubMenu = new GridSubMenu(this.mb, this.store, this.hotkeysService);
  private pageAlignSubMenu = new PageAlignSubMenu(this.mb, this.store);
  private screenPixelDensitySubMenu = new ScreenPixelDensitySubMenu(this.mb, this.store);
  private zoomSubMenu = new ZoomSubMenu(
    this.mb,
    this.store,
    this.zoomService,
    this.hotkeysService
  );

  private viewMenuItem: AppMenuItem = this.mb.appMenuItem({
    label: 'View',
    visible$: this.store.select(selectStatus).pipe(map((status) => status !== 'closed')),
    subMenu: this.mb.subMenu({
      id: 'view-sub-menu',
      menuItemGroups: [
        this.mb.menuItemGroup([
          this.showRulers.getItem(),
          this.showShapeInspector.getItem(),
          this.shapeSnap.getItem(),
          this.mousePositionSubMenu.getItem(),
          this.gridSubMenu.getItem(),
          this.pageAlignSubMenu.getItem(),
          this.screenPixelDensitySubMenu.getItem(),
          this.zoomSubMenu.getItem(),
        ]),
      ],
    }),
  });

  constructor(
    private mb: MenuBuilderService,
    private store: Store,
    private hotkeysService: HotkeysService,
    private zoomService: ZoomControlService
  ) {}

  getItem(): AppMenuItem {
    return this.viewMenuItem;
  }

  cleanup() {
    this.showRulers.cleanup();
    this.showShapeInspector.cleanup();
    this.shapeSnap.cleanup();
    this.mousePositionSubMenu.cleanup();
    this.gridSubMenu.cleanup();
    this.pageAlignSubMenu.cleanup();
    this.screenPixelDensitySubMenu.cleanup();
    this.zoomSubMenu.cleanup();
  }
}
