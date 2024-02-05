import { CommandItem, MenuBuilderService } from '@tfx-diagram/shared-angular/ui/tfx-menu';
import { of } from 'rxjs';

export class UndoCommand {
  private item = this.mb.commandItem({
    label: 'Undo',
    subLabel: 'Ctrl+Z',
    disabled$: of(true),
    exec: this.doUndo(),
  });

  constructor(private mb: MenuBuilderService) {}

  getItem(): CommandItem {
    return this.item;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  cleanup() {}

  private doUndo(): (commandItem: CommandItem) => void {
    return () => {
      console.log('Undo clicked');
    };
  }
}
