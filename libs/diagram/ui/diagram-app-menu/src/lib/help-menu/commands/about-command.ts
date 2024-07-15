// import {
//   CommandItem,
//   MenuBuilderService,
// } from '@tfx-diagram/shared-angular/ui/tfx-menu';

import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { HelpMenuActions } from '@tfx-diagram/diagram-data-access-store-actions';
import { CommandItem, MenuBuilderService } from '@tfx-diagram/shared-angular/ui/tfx-menu';
import { AboutDialogComponent } from './about-dialog.component';

// export const aboutCommand = (mb: MenuBuilderService): CommandItem => {
//   return mb.commandItem({
//     label: 'About',
//     exec: doAbout(),
//   });
// };

// const doAbout = (): ((commandItem: CommandItem) => void) => {
//   return () => {
//     console.log('Help | About clicked');
//   };
// };
export class AboutCommand {
  private item = this.mb.commandItem({
    label: 'About',
    exec: this.doAbout(),
  });

  constructor(
    private mb: MenuBuilderService,
    private store: Store,
    private dialog: MatDialog
  ) {}

  getItem(): CommandItem {
    return this.item;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  cleanup() {}

  private doAbout(): (commandItem: CommandItem) => void {
    return () => {
      this.store.dispatch(HelpMenuActions.aboutClick());
      const dialogRef: MatDialogRef<AboutDialogComponent> = this.dialog.open(
        AboutDialogComponent,
        { autoFocus: true }
      );
      dialogRef.afterClosed().subscribe(() => {
        this.store.dispatch(HelpMenuActions.aboutDialogClosed());
      });
    };
  }
}
