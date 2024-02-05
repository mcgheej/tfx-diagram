import { Store } from '@ngrx/store';
import { ArrangeMenuActions } from '@tfx-diagram/diagram-data-access-store-actions';
import { selectSelectedShapeIds } from '@tfx-diagram/diagram/data-access/store/features/control-frame';
import { selectShapes } from '@tfx-diagram/diagram/data-access/store/features/shapes';
import { CommandItem, MenuBuilderService } from '@tfx-diagram/shared-angular/ui/tfx-menu';
import { Hotkey, HotkeysService } from 'angular2-hotkeys';
import { map, Subscription, withLatestFrom } from 'rxjs';

export class UngroupCommand {
  private hotkey: Hotkey | null = null;

  private disableUngroupCmd$ = this.store.select(selectSelectedShapeIds).pipe(
    withLatestFrom(this.store.select(selectShapes)),
    map(([selectedIds, shapes]) => {
      for (const id of selectedIds) {
        const s = shapes.get(id);
        if (s && s.shapeType === 'group') {
          return false;
        }
      }
      return true;
    })
  );

  private item = this.mb.commandItem({
    label: 'Ungroup',
    subLabel: 'Ctrl+Shift+G',
    disabled$: this.disableUngroupCmd$,
    exec: this.doUngroup(),
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
    this.hotkey = new Hotkey('ctrl+shift+g', () => {
      this.doUngroup()(this.item);
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

  private doUngroup(): (commandItem: CommandItem) => void {
    return () => {
      this.store.dispatch(
        ArrangeMenuActions.ungroupClick({ selectedShapeIds: this.selectedShapeIds })
      );
    };
  }
}
