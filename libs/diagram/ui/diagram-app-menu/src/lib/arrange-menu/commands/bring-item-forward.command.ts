import { Store } from '@ngrx/store';
import { ArrangeMenuActions } from '@tfx-diagram/diagram-data-access-store-actions';
import {
  selectNumberOfSelectedShapes,
  selectSelectedShapeIds,
} from '@tfx-diagram/diagram/data-access/store/features/control-frame';
import { CommandItem, MenuBuilderService } from '@tfx-diagram/shared-angular/ui/tfx-menu';
import { map, Subscription } from 'rxjs';

export class BringItemForwardCommand {
  private item = this.mb.commandItem({
    label: 'Bring Item Forward',
    disabled$: this.store.select(selectNumberOfSelectedShapes).pipe(map((n) => n !== 1)),
    exec: this.doBringItemForward(),
  });

  private selectedShapeIds: string[] = [];
  private subscription: Subscription | null = null;

  constructor(private mb: MenuBuilderService, private store: Store) {
    this.subscription = this.store.select(selectSelectedShapeIds).subscribe((ids) => {
      this.selectedShapeIds = ids;
    });
  }

  getItem(): CommandItem {
    return this.item;
  }

  cleanup() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  private doBringItemForward(): (commandItem: CommandItem) => void {
    return () => {
      if (this.selectedShapeIds.length === 1) {
        this.store.dispatch(
          ArrangeMenuActions.bringItemForward({ selectedShapeId: this.selectedShapeIds[0] })
        );
      }
    };
  }
}
