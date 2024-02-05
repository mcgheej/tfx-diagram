import { Store } from '@ngrx/store';
import { FileMenuActions } from '@tfx-diagram/diagram-data-access-store-actions';
import { selectStatus } from '@tfx-diagram/diagram-data-access-store-features-sketchbook';
import { CommandItem, MenuBuilderService } from '@tfx-diagram/shared-angular/ui/tfx-menu';
import { map } from 'rxjs';

export class SaveCommand {
  private disabled$ = this.store
    .select(selectStatus)
    .pipe(map((status) => status !== 'modified'));

  private item = this.mb.commandItem({
    label: 'Save',
    exec: this.doSave(),
    disabled$: this.disabled$,
  });

  constructor(private mb: MenuBuilderService, private store: Store) {}

  getItem(): CommandItem {
    return this.item;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  cleanup() {}

  private doSave(): (commandItem: CommandItem) => void {
    return () => {
      this.store.dispatch(FileMenuActions.saveSketchbookClick());
    };
  }
}
