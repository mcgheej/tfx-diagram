import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { LineWidthButtonServiceActions } from '@tfx-diagram/diagram-data-access-store-actions';
import { LineWidthDialogComponent } from './line-width-dialog/line-width-dialog.component';
import { LineWidthDialogData } from './line-width-dialog/line-width-dialog.types';

@Injectable({ providedIn: 'root' })
export class LineWidthButtonService {
  constructor(private dialog: MatDialog, private store: Store) {}

  openLineWidthDialog(el: HTMLElement, lineWidth: number) {
    let config: MatDialogConfig<LineWidthDialogData> = {
      data: { lineWidth },
      width: '275px',
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
    this.store.dispatch(LineWidthButtonServiceActions.lineWidthDialogOpening());
    const dialogRef: MatDialogRef<LineWidthDialogComponent, number> = this.dialog.open(
      LineWidthDialogComponent,
      config
    );
    dialogRef.afterClosed().subscribe((selectedLineWidth) => {
      this.store.dispatch(LineWidthButtonServiceActions.lineWidthDialogClosed());
      if (selectedLineWidth) {
        this.store.dispatch(
          LineWidthButtonServiceActions.lineWidthChange({ lineWidth: selectedLineWidth })
        );
      }
    });
  }
}
