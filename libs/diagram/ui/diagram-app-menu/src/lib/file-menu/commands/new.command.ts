import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { FileMenuActions } from '@tfx-diagram/diagram-data-access-store-actions';
import { NewDialogComponent, NewDialogResult } from '@tfx-diagram/diagram/ui/dialogs';
import { SaveCloseMachineService } from '@tfx-diagram/diagram/ui/file-save-close-xstate';
import { CommandItem, MenuBuilderService } from '@tfx-diagram/shared-angular/ui/tfx-menu';

export class NewCommand {
  private item = this.mb.commandItem({
    label: 'New',
    exec: this.doNew(),
  });

  constructor(
    private mb: MenuBuilderService,
    private store: Store,
    private dialog: MatDialog,
    private saveCloseMachine: SaveCloseMachineService
  ) {}

  getItem(): CommandItem {
    return this.item;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  cleanup() {}

  private doNew(): (commandItem: CommandItem) => void {
    return () => {
      this.saveCloseMachine.start().subscribe((result) => {
        if (result === 'closed') {
          this.store.dispatch(FileMenuActions.newSketchbookClick());
          const dialogRef: MatDialogRef<NewDialogComponent, NewDialogResult> = this.dialog.open(
            NewDialogComponent,
            {
              autoFocus: true,
              height: '450px',
              data: {
                dialogType: 'Sketchbook',
              },
            }
          );
          dialogRef.afterClosed().subscribe((result) => {
            if (result) {
              this.store.dispatch(
                FileMenuActions.newSketchbookCreate({
                  sketchbookTitle: result.title,
                  page: {
                    title: 'Page 1',
                    size: {
                      width: result.width,
                      height: result.height,
                    },
                    format: result.pageFormat,
                    layout: result.layout,
                  },
                })
              );
            } else {
              this.store.dispatch(FileMenuActions.newSketchbookCancel());
            }
          });
        }
      });
    };
  }
}
