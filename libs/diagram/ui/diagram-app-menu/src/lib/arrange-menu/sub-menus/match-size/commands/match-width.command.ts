import { Store } from '@ngrx/store';
import { ArrangeMenuActions } from '@tfx-diagram/diagram-data-access-store-actions';
import {
  selectNumberOfSelectedShapes,
  selectSelectedShapeIds,
} from '@tfx-diagram/diagram/data-access/store/features/control-frame';
import { CommandItem, MenuBuilderService } from '@tfx-diagram/shared-angular/ui/tfx-menu';
import { map, Subscription } from 'rxjs';

export class MatchWidthCommand {
  private item = this.mb.commandItem({
    label: 'Width',
    disabled$: this.store.select(selectNumberOfSelectedShapes).pipe(map((n) => n < 2)),
    exec: this.doMatchWidth(),
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

  private doMatchWidth(): (commandItem: CommandItem) => void {
    return () => {
      if (this.selectedShapeIds.length > 1) {
        this.store.dispatch(
          ArrangeMenuActions.shapeResizeClick({
            selectedShapeIds: this.selectedShapeIds,
            resizeOption: 'widthOnly',
          })
        );
      }
    };
  }
}
