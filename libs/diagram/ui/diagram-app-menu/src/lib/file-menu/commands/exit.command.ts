import { SaveCloseMachineService } from '@tfx-diagram/diagram/ui/file-save-close-xstate';
import { CommandItem, MenuBuilderService } from '@tfx-diagram/shared-angular/ui/tfx-menu';
import { Subject } from 'rxjs';

export class ExitCommand {
  private item = this.mb.commandItem({
    label: 'Exit',
    exec: this.doExit(this.cmds$),
  });

  constructor(
    private mb: MenuBuilderService,
    private cmds$: Subject<string>,
    private saveCloseMachine: SaveCloseMachineService
  ) {}

  getItem(): CommandItem {
    return this.item;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  cleanup() {}

  private doExit(cmds$: Subject<string>): (commandItem: CommandItem) => void {
    return () => {
      this.saveCloseMachine.start().subscribe((result) => {
        this.saveCloseMachine.stop();
        if (result === 'closed') {
          cmds$.next('file-exit');
        }
      });
    };
  }
}
