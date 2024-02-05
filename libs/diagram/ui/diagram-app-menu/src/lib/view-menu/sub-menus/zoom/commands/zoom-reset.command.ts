import { Store } from '@ngrx/store';
import { INITIAL_ZOOM_FACTOR } from '@tfx-diagram/electron-renderer-web/shared-types';
import { CommandItem, MenuBuilderService } from '@tfx-diagram/shared-angular/ui/tfx-menu';
import { Hotkey, HotkeysService } from 'angular2-hotkeys';
import { ZoomCommandBase } from './zoom-command-base';

export class ZoomResetCommand extends ZoomCommandBase {
  private hotkey: Hotkey | null = null;

  private item = this.mb.commandItem({
    label: 'Reset Zoom',
    subLabel: 'Ctrl+0',
    exec: this.execZoomCommand(INITIAL_ZOOM_FACTOR),
  });

  constructor(
    private mb: MenuBuilderService,
    store: Store,
    private hotkeysService: HotkeysService
  ) {
    super(store);
  }

  getItem(): CommandItem {
    if (this.hotkey) {
      this.hotkeysService.remove(this.hotkey);
    }
    this.hotkey = new Hotkey('ctrl+0', () => {
      this.execZoomCommand(INITIAL_ZOOM_FACTOR)(this.item);
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
}
