import { Store } from '@ngrx/store';
import { selectStatus } from '@tfx-diagram/diagram-data-access-store-features-sketchbook';
import { SaveCloseMachineService } from '@tfx-diagram/diagram/ui/file-save-close-xstate';
import { CommandItem, MenuBuilderService } from '@tfx-diagram/shared-angular/ui/tfx-menu';
import { map } from 'rxjs';

export class CloseCommand {
  private disabled$ = this.store.select(selectStatus).pipe(
    map((status) => {
      return status !== 'saved' && status !== 'modified';
    })
  );

  private item = this.mb.commandItem({
    label: 'Close',
    exec: this.doClose(),
    disabled$: this.disabled$,
  });

  constructor(
    private mb: MenuBuilderService,
    private store: Store,
    private saveCloseMachine: SaveCloseMachineService
  ) {}

  getItem(): CommandItem {
    return this.item;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  cleanup() {}

  private doClose(): (commandItem: CommandItem) => void {
    return () => {
      this.saveCloseMachine.start().subscribe(() => {
        this.saveCloseMachine.stop();
      });
    };
  }
}
