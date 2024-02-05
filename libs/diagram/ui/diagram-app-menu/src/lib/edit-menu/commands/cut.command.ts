import { Store } from '@ngrx/store';
import { EditMenuActions } from '@tfx-diagram/diagram-data-access-store-actions';
import {
  selectNumberOfSelectedShapes,
  selectSelectedShapeIds,
  selectTextEdit,
} from '@tfx-diagram/diagram/data-access/store/features/control-frame';
import { TextEdit } from '@tfx-diagram/diagram/data-access/text-classes';
import { CommandItem, MenuBuilderService } from '@tfx-diagram/shared-angular/ui/tfx-menu';
import { Hotkey, HotkeysService } from 'angular2-hotkeys';
import { combineLatest, map, Subscription } from 'rxjs';

export class CutCommand {
  private hotkey: Hotkey | null = null;

  private disableCutCmd$ = combineLatest([
    this.store.select(selectNumberOfSelectedShapes),
    this.store.select(selectTextEdit),
  ]).pipe(
    map(([nSelectedShapes, textEdit]) => {
      return nSelectedShapes === 0 || textEdit !== null;
    })
  );

  // private disableCutCmd$ = this.store.select(selectNumberOfSelectedShapes).pipe(
  //   map((n) => {
  //     return n === 0;
  //   })
  // );

  private item = this.mb.commandItem({
    label: 'Cut',
    subLabel: 'Ctrl+X',
    disabled$: this.disableCutCmd$,
    exec: this.doCut(),
  });

  private selectedShapeIds: string[] = [];
  private textEdit: TextEdit | null = null;
  private subscription: Subscription | null = null;

  constructor(
    private mb: MenuBuilderService,
    private store: Store,
    private hotkeysService: HotkeysService
  ) {
    this.subscription = combineLatest([
      this.store.select(selectSelectedShapeIds),
      this.store.select(selectTextEdit),
    ]).subscribe(([ids, tEdit]) => {
      this.selectedShapeIds = ids;
      this.textEdit = tEdit;
    });
  }

  getItem(): CommandItem {
    if (this.hotkey) {
      this.hotkeysService.remove(this.hotkey);
    }
    this.hotkey = new Hotkey('ctrl+x', () => {
      if (this.selectedShapeIds.length > 0 && this.textEdit === null) {
        this.doCut()(this.item);
      }
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

  private doCut(): (commandItem: CommandItem) => void {
    return () => {
      this.store.dispatch(
        EditMenuActions.cutClick({
          selectedShapeIds: this.selectedShapeIds,
          textEdit: this.textEdit,
        })
      );
    };
  }
}
