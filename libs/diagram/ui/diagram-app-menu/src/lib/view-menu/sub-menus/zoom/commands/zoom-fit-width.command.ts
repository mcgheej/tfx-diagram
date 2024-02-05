import { Store } from '@ngrx/store';
import { CommandItem, MenuBuilderService } from '@tfx-diagram/shared-angular/ui/tfx-menu';
import { Hotkey, HotkeysService } from 'angular2-hotkeys';
import { ZoomCommandBase } from './zoom-command-base';

export class ZoomFitWidthCommand extends ZoomCommandBase {
  private hotkey: Hotkey | null = null;

  private item = this.mb.commandItem({
    label: 'Zoom to Width',
    subLabel: 'Ctrl+1',
    exec: this.execZoomCommand('fit-to-width'),
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
    this.hotkey = new Hotkey('ctrl+1', () => {
      this.execZoomCommand('fit-to-width')(this.item);
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
