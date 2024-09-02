import { Store } from '@ngrx/store';
import { Shape } from '@tfx-diagram/diagram-data-access-shape-base-class';
import { ArrangeMenuActions } from '@tfx-diagram/diagram-data-access-store-actions';
import { selectCurrentPage } from '@tfx-diagram/diagram-data-access-store-features-pages';
import {
  selectNumberOfSelectedShapes,
  selectSelectedShapeIds,
} from '@tfx-diagram/diagram/data-access/store/features/control-frame';
import { CommandItem, MenuBuilderService } from '@tfx-diagram/shared-angular/ui/tfx-menu';
import { combineLatest, map, take } from 'rxjs';

export function getBringItemForward(
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
        if (currentPage.lastShapeId === shapeUnderMouse.id || shapeUnderMouse.groupId) {
          return true;
        }
        return false;
      }
      return true;
    })
  );
  return mb.commandItem({
    label: 'Bring Item Forward',
    disabled$,
    exec: bringItemForward(store),
  });
}

function bringItemForward(store: Store): (commandItem: CommandItem) => void {
  return () => {
    store
      .select(selectSelectedShapeIds)
      .pipe(take(1))
      .subscribe((selectedShapeIds) => {
        if (selectedShapeIds.length === 1) {
          store.dispatch(
            ArrangeMenuActions.bringItemForward({ selectedShapeId: selectedShapeIds[0] })
          );
        }
      });
  };
}
