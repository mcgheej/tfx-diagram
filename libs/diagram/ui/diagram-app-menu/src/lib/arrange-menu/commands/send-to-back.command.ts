import { Store } from '@ngrx/store';
import { ArrangeMenuActions } from '@tfx-diagram/diagram-data-access-store-actions';
import {
  selectNumberOfSelectedShapes,
  selectSelectedShapeIds,
} from '@tfx-diagram/diagram/data-access/store/features/control-frame';
import { CommandItem, MenuBuilderService } from '@tfx-diagram/shared-angular/ui/tfx-menu';
import { Hotkey, HotkeysService } from 'angular2-hotkeys';
import { map, Subscription } from 'rxjs';

export class SendToBackCommand {
  private hotkey: Hotkey | null = null;

  private item = this.mb.commandItem({
    label: 'Send to Back',
    subLabel: 'Ctrl+Alt+[',
    disabled$: this.store.select(selectNumberOfSelectedShapes).pipe(map((n) => n === 0)),
    exec: this.doSendToBack(),
  });

  private selectedShapeIds: string[] = [];
  private subscription: Subscription | null = null;

  constructor(
    private mb: MenuBuilderService,
    private store: Store,
    private hotkeysService: HotkeysService
  ) {
    this.subscription = this.store.select(selectSelectedShapeIds).subscribe((ids) => {
      this.selectedShapeIds = ids;
    });
  }

  getItem(): CommandItem {
    if (this.hotkey) {
      this.hotkeysService.remove(this.hotkey);
    }
    this.hotkey = new Hotkey('ctrl+alt+[', () => {
      this.doSendToBack()(this.item);
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
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  private doSendToBack(): (commandItem: CommandItem) => void {
    return () => {
      this.store.dispatch(
        ArrangeMenuActions.sendToBackClick({ selectedShapeIds: this.selectedShapeIds })
      );
    };
  }
}
