import { CommandItem, MenuBuilderService } from '@tfx-diagram/shared-angular/ui/tfx-menu';
import { of } from 'rxjs';

export class RedoCommand {
  private item = this.mb.commandItem({
    label: 'Redo',
    subLabel: 'Ctrl+Y',
    disabled$: of(true),
    exec: this.doRedo(),
  });

  constructor(private mb: MenuBuilderService) {}

  getItem(): CommandItem {
    return this.item;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  cleanup() {}

  private doRedo(): (commandItem: CommandItem) => void {
    return () => {
      console.log('Redo clicked');
    };
  }
}
