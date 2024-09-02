import { Store } from '@ngrx/store';
import { ArrangeMenuActions } from '@tfx-diagram/diagram-data-access-store-actions';
import { selectSelectedShapeIds } from '@tfx-diagram/diagram/data-access/store/features/control-frame';
import { CommandItem, MenuBuilderService } from '@tfx-diagram/shared-angular/ui/tfx-menu';
import { take } from 'rxjs';

export function getSendToBack(store: Store, mb: MenuBuilderService): CommandItem {
  return mb.commandItem({
    label: 'Send to Back',
    subLabel: 'Ctrl+Alt+[',
    exec: sendToFront(store),
  });
}

function sendToFront(store: Store): (commandItem: CommandItem) => void {
  return () => {
    store
      .select(selectSelectedShapeIds)
      .pipe(take(1))
      .subscribe((selectedShapeIds) => {
        store.dispatch(ArrangeMenuActions.sendToBackClick({ selectedShapeIds }));
      });
  };
}
