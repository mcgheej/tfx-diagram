import { Store } from '@ngrx/store';
import { ArrangeMenuActions } from '@tfx-diagram/diagram-data-access-store-actions';
import { selectCurrentPage } from '@tfx-diagram/diagram-data-access-store-features-pages';
import { selectSelectedShapeIds } from '@tfx-diagram/diagram/data-access/store/features/control-frame';
import { selectShapes } from '@tfx-diagram/diagram/data-access/store/features/shapes';
import { CommandItem, MenuBuilderService } from '@tfx-diagram/shared-angular/ui/tfx-menu';
import { combineLatest, map, take } from 'rxjs';

export class BringItemForwardCommand {
  private disabled$ = combineLatest([
    this.store.select(selectSelectedShapeIds),
    this.store.select(selectCurrentPage),
    this.store.select(selectShapes),
  ]).pipe(
    map(([selectedShapeIds, currentPage, shapes]) => {
      if (selectedShapeIds.length !== 1) {
        return true;
      }
      const selectedShape = shapes.get(selectedShapeIds[0]);
      if (currentPage && selectedShape) {
        if (
          currentPage.lastShapeId === selectedShape.id ||
          selectedShape.shapeType === 'group'
        ) {
          return true;
        }
        return false;
      }
      return true;
    })
  );

  private item = this.mb.commandItem({
    label: 'Bring Item Forward',
    disabled$: this.disabled$,
    exec: this.doBringItemForward(),
  });

  constructor(private mb: MenuBuilderService, private store: Store) {}

  getItem(): CommandItem {
    return this.item;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  cleanup() {}

  private doBringItemForward(): (commandItem: CommandItem) => void {
    return () => {
      this.store
        .select(selectSelectedShapeIds)
        .pipe(take(1))
        .subscribe((selectedShapeIds) => {
          if (selectedShapeIds.length === 1) {
            this.store.dispatch(
              ArrangeMenuActions.bringItemForward({ selectedShapeId: selectedShapeIds[0] })
            );
          }
        });
    };
  }
}
