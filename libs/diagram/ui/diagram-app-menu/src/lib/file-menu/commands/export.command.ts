import { Store } from '@ngrx/store';
import { FileMenuActions } from '@tfx-diagram/diagram-data-access-store-actions';
import { selectStatus } from '@tfx-diagram/diagram-data-access-store-features-sketchbook';
import { CommandItem, MenuBuilderService } from '@tfx-diagram/shared-angular/ui/tfx-menu';
import { map } from 'rxjs';

export class ExportCommand {
  private disabled$ = this.store.select(selectStatus).pipe(
    map((status) => {
      return status !== 'saved' && status !== 'modified';
    })
  );

  private item = this.mb.commandItem({
    label: 'Export Page as JPEG',
    exec: this.doExport(),
    disabled$: this.disabled$,
  });

  constructor(private mb: MenuBuilderService, private store: Store) {}

  getItem(): CommandItem {
    return this.item;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  cleanup() {}

  private doExport(): (commandItem: CommandItem) => void {
    return () => {
      this.store.dispatch(FileMenuActions.exportSketchbookClick());
    };
  }
}
