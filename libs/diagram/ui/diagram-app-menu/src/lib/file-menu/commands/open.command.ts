import { Store } from '@ngrx/store';
import { FileMenuActions } from '@tfx-diagram/diagram-data-access-store-actions';
import { SaveCloseMachineService } from '@tfx-diagram/diagram/ui/file-save-close-xstate';
import { CommandItem, MenuBuilderService } from '@tfx-diagram/shared-angular/ui/tfx-menu';

export class OpenCommand {
  private item = this.mb.commandItem({
    label: 'Open',
    exec: this.doOpen(),
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

  private doOpen(): (commandItem: CommandItem) => void {
    return () => {
      this.saveCloseMachine.start().subscribe({
        next: (result) => {
          if (result === 'closed') {
            this.store.dispatch(FileMenuActions.openSketchbookClick());
          }
        },
        complete: () => this.saveCloseMachine.stop(),
      });
    };
  }
}
