import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';

export interface SaveCloseContext {
  store: Store;
  dialog: MatDialog;
}
