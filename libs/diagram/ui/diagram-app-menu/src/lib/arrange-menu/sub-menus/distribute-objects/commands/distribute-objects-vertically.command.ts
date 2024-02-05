import { Store } from '@ngrx/store';
import { ArrangeMenuActions } from '@tfx-diagram/diagram-data-access-store-actions';
import {
  selectNumberOfSelectedShapes,
  selectSelectedShapeIds,
} from '@tfx-diagram/diagram/data-access/store/features/control-frame';
import { CommandItem, MenuBuilderService } from '@tfx-diagram/shared-angular/ui/tfx-menu';
import { map, Subscription } from 'rxjs';

export class DistributeObjectsVerticallyCommand {
  private item = this.mb.commandItem({
    label: 'Vertically',
    disabled$: this.store.select(selectNumberOfSelectedShapes).pipe(map((n) => n < 3)),
    exec: this.doDistributeObjectsVertically(),
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

  private doDistributeObjectsVertically(): (commandItem: CommandItem) => void {
    return () => {
      this.store.dispatch(
        ArrangeMenuActions.distributeObjectsClick({
          value: 'vertically',
          selectedShapeIds: this.selectedShapeIds,
        })
      );
    };
  }
}
