import { Injectable } from '@angular/core';
import { MatLegacyDialog as MatDialog, MatLegacyDialogConfig as MatDialogConfig, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { Store } from '@ngrx/store';
import { LineDashButtonServiceActions } from '@tfx-diagram/diagram-data-access-store-actions';
import { LineDashDialogComponent } from './line-dash-dialog/line-dash-dialog.component';
import { LineDashDialogData } from './line-dash-dialog/line-dash-dialog.types';

@Injectable({ providedIn: 'root' })
export class LineDashButtonService {
  constructor(private dialog: MatDialog, private store: Store) {}

  openLineDashDialog(el: HTMLElement, lineDash: number[]) {
    let config: MatDialogConfig<LineDashDialogData> = {
      data: { lineDash },
      width: '350px',
      height: '300px',
      backdropClass: 'tfx-dialog-backdrop-transparent',
    };
    if (el) {
      const { offsetLeft: left, offsetTop: top, offsetHeight: height } = el;
      config = {
        ...config,
        position: {
          left: `${left}px`,
          top: `${top + height}px`,
        },
      };
    }
    this.store.dispatch(LineDashButtonServiceActions.lineDashDialogOpening());
    const dialogRef: MatDialogRef<LineDashDialogComponent, number[]> = this.dialog.open(
      LineDashDialogComponent,
      config
    );
    dialogRef.afterClosed().subscribe((selectedLineDash) => {
      this.store.dispatch(LineDashButtonServiceActions.lineDashDialogClosed());
      if (selectedLineDash) {
        this.store.dispatch(
          LineDashButtonServiceActions.lineDashChange({ lineDash: selectedLineDash })
        );
        console.log(lineDash);
      }
    });
  }
}
