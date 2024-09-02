import { Store } from '@ngrx/store';
import { EditMenuActions } from '@tfx-diagram/diagram-data-access-store-actions';
import { selectSelectedShapeIds } from '@tfx-diagram/diagram/data-access/store/features/control-frame';
import { CommandItem, MenuBuilderService } from '@tfx-diagram/shared-angular/ui/tfx-menu';
import { map, take } from 'rxjs';

export function getDuplicate(store: Store, mb: MenuBuilderService): CommandItem {
  const disabled$ = store.select(selectSelectedShapeIds).pipe(map((ids) => ids.length === 0));
  return mb.commandItem({
    label: 'Duplicate',
    subLabel: 'Ctrl+D',
    disabled$,
    exec: duplicate(store),
  });
}

function duplicate(store: Store): (commandItem: CommandItem) => void {
  return () => {
    store
      .select(selectSelectedShapeIds)
      .pipe(take(1))
      .subscribe((selectedShapeIds) => {
        if (selectedShapeIds.length > 0) {
          store.dispatch(EditMenuActions.duplicateClick({ selectedShapeIds }));
        }
      });
  };
}
