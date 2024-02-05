import { Store } from '@ngrx/store';
import { ViewMenuActions } from '@tfx-diagram/diagram-data-access-store-actions';
import { ZoomControlService } from '@tfx-diagram/diagram/ui/zoom-control';
import { CommandItem, MenuBuilderService } from '@tfx-diagram/shared-angular/ui/tfx-menu';
import { Hotkey, HotkeysService } from 'angular2-hotkeys';
import { ZoomCommandBase } from './zoom-command-base';

export class ZoomDecreaseCommand extends ZoomCommandBase {
  private hotkey: Hotkey | null = null;

  private item = this.mb.commandItem({
    label: 'Zoom Out',
    subLabel: 'Ctrl+-',
    exec: this.execDecreaseZoom(),
  });

  constructor(
    private mb: MenuBuilderService,
    store: Store,
    private zoomService: ZoomControlService,
    private hotkeysService: HotkeysService
  ) {
    super(store);
  }

  getItem(): CommandItem {
    if (this.hotkey) {
      this.hotkeysService.remove(this.hotkey);
    }
    this.hotkey = new Hotkey('ctrl+-', () => {
      this.execDecreaseZoom()(this.item);
      return false;
    });
    this.hotkeysService.add(this.hotkey);
    return this.item;
  }

  cleanup() {
    if (this.hotkey) {
      this.hotkeysService.remove(this.hotkey);
      this.hotkey = null;
    }
  }

  private execDecreaseZoom(): (commandItem: CommandItem) => void {
    return () => {
      this.store.dispatch(
        ViewMenuActions.zoomChange({
          zoomSelected: this.zoomService.getDecreasedZoom(),
        })
      );
    };
  }
}
