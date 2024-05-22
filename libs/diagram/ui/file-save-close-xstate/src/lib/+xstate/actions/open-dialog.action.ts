import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { SaveCloseMachineActions } from '@tfx-diagram/diagram-data-access-store-actions';
import { SaveDiscardCancelDialogComponent } from '../../save-discard-cancel-dialog/save-discard-cancel-dialog.component';

export function openDialog(_: unknown, params: { store: Store; dialog: MatDialog }) {
  const { store, dialog } = params;
  store.dispatch(SaveCloseMachineActions.saveStart());
  const dialogRef = dialog.open(SaveDiscardCancelDialogComponent, {
    width: '350px',
  });
  dialogRef.afterClosed().subscribe((result) => {
    if (result) {
      switch (result) {
        case 'save': {
          store.dispatch(SaveCloseMachineActions.saveClick());
          break;
        }
        case 'discard': {
          store.dispatch(SaveCloseMachineActions.discardClick());
          break;
        }
        case 'cancel': {
          store.dispatch(SaveCloseMachineActions.cancelClick());
          break;
        }
      }
    } else {
      store.dispatch(SaveCloseMachineActions.cancelClick());
    }
  });
}
