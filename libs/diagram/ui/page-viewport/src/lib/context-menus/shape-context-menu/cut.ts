import { Store } from '@ngrx/store';
import { EditMenuActions } from '@tfx-diagram/diagram-data-access-store-actions';
import {
  selectNumberOfSelectedShapes,
  selectSelectedShapeIds,
  selectTextEdit,
} from '@tfx-diagram/diagram/data-access/store/features/control-frame';
import { CommandItem, MenuBuilderService } from '@tfx-diagram/shared-angular/ui/tfx-menu';
import { combineLatest, map, take } from 'rxjs';

export function getCut(store: Store, mb: MenuBuilderService): CommandItem {
  const disabled$ = combineLatest([
    store.select(selectNumberOfSelectedShapes),
    store.select(selectTextEdit),
  ]).pipe(
    map(([nSelectedShapes, textEdit]) => {
      return nSelectedShapes === 0 || textEdit !== null;
    })
  );
  return mb.commandItem({
    label: 'Cut',
    subLabel: 'Ctrl+X',
    disabled$,
    exec: cut(store),
  });
}

function cut(store: Store): (commandItem: CommandItem) => void {
  return () => {
    combineLatest([store.select(selectSelectedShapeIds), store.select(selectTextEdit)])
      .pipe(take(1))
      .subscribe(([selectedShapeIds, textEdit]) => {
        if (selectedShapeIds.length > 0 && textEdit === null) {
          store.dispatch(
            EditMenuActions.cutClick({
              selectedShapeIds,
              textEdit,
            })
          );
        }
      });
  };
}
