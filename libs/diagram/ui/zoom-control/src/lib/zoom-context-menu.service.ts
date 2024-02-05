import { Inject, Injectable } from '@angular/core';
import {
  CommandItem,
  ContextMenu,
  MenuBuilderService,
} from '@tfx-diagram/shared-angular/ui/tfx-menu';
import { Subject } from 'rxjs';
import { ZOOM_DATA } from './zoom-control.tokens';
import { ZoomControlConfig, ZoomSelectType } from './zoom-control.types';

@Injectable()
export class ZoomContextMenuService {
  private zoomOptionsMenu!: ContextMenu;
  private menuResultSubject$ = new Subject<ZoomSelectType>();
  menuResult$ = this.menuResultSubject$.asObservable();

  constructor(
    private mb: MenuBuilderService,
    @Inject(ZOOM_DATA) private zoomConfig: ZoomControlConfig
  ) {}

  getContextMenu(): ContextMenu {
    this.zoomOptionsMenu =
      this.zoomOptionsMenu ??
      this.mb.contextMenu({
        id: 'zoom-control-options-menu',
        menuItemGroups: [
          this.mb.menuItemGroup([
            this.mb.commandItem({
              label: 'Zoom to Width',
              subLabel: 'Ctrl+1',
              exec: this.setZoomFromMenu('fit-to-width'),
            }),
            this.mb.commandItem({
              label: 'Zoom to Page',
              subLabel: 'Ctrl+2',
              exec: this.setZoomFromMenu('fit-to-window'),
            }),
            this.mb.commandItem({
              label: 'Reset Zoom',
              subLabel: 'Ctrl+0',
              exec: this.setZoomFromMenu(this.zoomConfig.initialZoomFactor),
            }),
          ]),
        ],
      });
    return this.zoomOptionsMenu;
  }

  private setZoomFromMenu(newZoomFactor: ZoomSelectType): (commandItem: CommandItem) => void {
    return () => {
      this.menuResultSubject$.next(newZoomFactor);
    };
  }
}
