import { Store } from '@ngrx/store';
import { ArrangeMenuActions } from '@tfx-diagram/diagram-data-access-store-actions';
import {
  selectNumberOfSelectedShapes,
  selectSelectedShapeIds,
} from '@tfx-diagram/diagram/data-access/store/features/control-frame';
import { CommandItem, MenuBuilderService } from '@tfx-diagram/shared-angular/ui/tfx-menu';
import { map, take } from 'rxjs';

export function getBringToFront(store: Store, mb: MenuBuilderService): CommandItem {
  return mb.commandItem({
    label: 'Bring to Front',
    subLabel: 'Ctrl+Alt+]',
    disabled$: store.select(selectNumberOfSelectedShapes).pipe(map((n) => n === 0)),
    exec: bringToFront(store),
  });
}

function bringToFront(store: Store): (commandItem: CommandItem) => void {
  return () => {
    store
      .select(selectSelectedShapeIds)
      .pipe(take(1))
      .subscribe((selectedShapeIds) => {
        store.dispatch(ArrangeMenuActions.bringToFrontClick({ selectedShapeIds }));
      });
  };
}
