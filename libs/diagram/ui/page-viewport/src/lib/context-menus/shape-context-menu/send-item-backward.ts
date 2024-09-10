import { Store } from '@ngrx/store';
import { ArrangeMenuActions } from '@tfx-diagram/diagram-data-access-store-actions';
import { selectCurrentPage } from '@tfx-diagram/diagram-data-access-store-features-pages';
import { Shape } from '@tfx-diagram/diagram/data-access/shape-classes';
import {
  selectNumberOfSelectedShapes,
  selectSelectedShapeIds,
} from '@tfx-diagram/diagram/data-access/store/features/control-frame';
import { CommandItem, MenuBuilderService } from '@tfx-diagram/shared-angular/ui/tfx-menu';
import { combineLatest, map, take } from 'rxjs';

export function getSendItemBackward(
  store: Store,
  mb: MenuBuilderService,
  shapeUnderMouse: Shape
): CommandItem {
  const disabled$ = combineLatest([
    store.select(selectNumberOfSelectedShapes),
    store.select(selectCurrentPage),
  ]).pipe(
    map(([numberOfSelectedShapes, currentPage]) => {
      if (numberOfSelectedShapes !== 1) {
        return true;
      }
      if (currentPage) {
        if (currentPage.firstShapeId === shapeUnderMouse.id || shapeUnderMouse.groupId) {
          return true;
        }
        return false;
      }
      return true;
    })
  );
  return mb.commandItem({
    label: 'Send Item Backward',
    disabled$,
    exec: sendItemBackward(store),
  });
}

function sendItemBackward(store: Store): (commandItem: CommandItem) => void {
  return () => {
    store
      .select(selectSelectedShapeIds)
      .pipe(take(1))
      .subscribe((selectedShapeIds) => {
        if (selectedShapeIds.length === 1) {
          store.dispatch(
            ArrangeMenuActions.sendItemBackward({ selectedShapeId: selectedShapeIds[0] })
          );
        }
      });
  };
}
