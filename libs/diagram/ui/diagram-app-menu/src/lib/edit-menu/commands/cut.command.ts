import { Store } from '@ngrx/store';
import { EditMenuActions } from '@tfx-diagram/diagram-data-access-store-actions';
import {
  selectNumberOfSelectedShapes,
  selectSelectedShapeIds,
  selectTextEdit,
} from '@tfx-diagram/diagram/data-access/store/features/control-frame';
import { CommandItem, MenuBuilderService } from '@tfx-diagram/shared-angular/ui/tfx-menu';
import { Hotkey, HotkeysService } from 'angular2-hotkeys';
import { combineLatest, map, take } from 'rxjs';

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

  private item = this.mb.commandItem({
    label: 'Cut',
    subLabel: 'Ctrl+X',
    disabled$: this.disableCutCmd$,
    exec: this.doCut(),
  });

  constructor(
    private mb: MenuBuilderService,
    private store: Store,
    private hotkeysService: HotkeysService
  ) {}

  getItem(): CommandItem {
    if (this.hotkey) {
      this.hotkeysService.remove(this.hotkey);
    }
    this.hotkey = new Hotkey('ctrl+x', () => {
      this.doCut()(this.item);
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

  private doCut(): (commandItem: CommandItem) => void {
    return () => {
      combineLatest([
        this.store.select(selectSelectedShapeIds),
        this.store.select(selectTextEdit),
      ])
        .pipe(take(1))
        .subscribe(([selectedShapeIds, textEdit]) => {
          if (selectedShapeIds.length > 0 && textEdit === null) {
            this.store.dispatch(
              EditMenuActions.cutClick({
                selectedShapeIds,
                textEdit,
              })
            );
          }
        });
    };
  }
}
