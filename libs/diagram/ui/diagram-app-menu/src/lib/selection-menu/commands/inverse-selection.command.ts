import { Store } from '@ngrx/store';
import { SelectionMenuActions } from '@tfx-diagram/diagram-data-access-store-actions';
import { selectSelectedShapeIds } from '@tfx-diagram/diagram/data-access/store/features/control-frame';
import { CommandItem, MenuBuilderService } from '@tfx-diagram/shared-angular/ui/tfx-menu';
import { map } from 'rxjs';

export class InverseSelectionCommand {
  private item = this.mb.commandItem({
    label: 'Inverse',
    disabled$: this.store
      .select(selectSelectedShapeIds)
      .pipe(map((selectedIds) => selectedIds.length === 0)),
    exec: this.doInverseSelection(),
  });

  constructor(private mb: MenuBuilderService, private store: Store) {}

  getItem(): CommandItem {
    return this.item;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  cleanup() {}

  private doInverseSelection(): (commandItem: CommandItem) => void {
    return () => {
      this.store.dispatch(SelectionMenuActions.inverseSelectionClick());
    };
  }
}
