import { Store } from '@ngrx/store';
import { ZoomControlService } from '@tfx-diagram/diagram/ui/zoom-control';
import { MenuBuilderService, SubMenuItem } from '@tfx-diagram/shared-angular/ui/tfx-menu';
import { HotkeysService } from 'angular2-hotkeys';
import { ZoomDecreaseCommand } from './commands/zoom-decrease.command';
import { ZoomFitPageCommand } from './commands/zoom-fit-page.command';
import { ZoomFitWidthCommand } from './commands/zoom-fit-width.command';
import { ZoomIncreaseCommand } from './commands/zoom-increase.command';
import { ZoomResetCommand } from './commands/zoom-reset.command';

export class ZoomSubMenu {
  private zoomIncreaseCommand = new ZoomIncreaseCommand(
    this.mb,
    this.store,
    this.zoomService,
    this.hotkeysService
  );
  private zoomDecreaseCommand = new ZoomDecreaseCommand(
    this.mb,
    this.store,
    this.zoomService,
    this.hotkeysService
  );
  private zoomFitWidthCommand = new ZoomFitWidthCommand(
    this.mb,
    this.store,
    this.hotkeysService
  );
  private zoomFitPageCommand = new ZoomFitPageCommand(this.mb, this.store, this.hotkeysService);
  private zoomResetCommand = new ZoomResetCommand(this.mb, this.store, this.hotkeysService);

  constructor(
    private mb: MenuBuilderService,
    private store: Store,
    private zoomService: ZoomControlService,
    private hotkeysService: HotkeysService
  ) {}

  getItem(): SubMenuItem {
    return this.mb.subMenuItem({
      label: 'Zoom',
      subMenu: this.mb.subMenu({
        id: 'view-zoom-sub-menu',
        menuItemGroups: [
          this.mb.menuItemGroup([
            this.zoomIncreaseCommand.getItem(),
            this.zoomDecreaseCommand.getItem(),
            this.zoomFitWidthCommand.getItem(),
            this.zoomFitPageCommand.getItem(),
            this.zoomResetCommand.getItem(),
          ]),
        ],
      }),
    });
  }

  cleanup() {
    this.zoomIncreaseCommand.cleanup();
    this.zoomDecreaseCommand.cleanup();
    this.zoomFitWidthCommand.cleanup();
    this.zoomFitPageCommand.cleanup();
    this.zoomResetCommand.cleanup();
  }
}
