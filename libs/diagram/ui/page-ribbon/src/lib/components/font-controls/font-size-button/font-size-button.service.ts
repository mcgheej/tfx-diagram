import { Injectable } from '@angular/core';
import { MatLegacyDialog as MatDialog, MatLegacyDialogConfig as MatDialogConfig, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { Store } from '@ngrx/store';
import { FontSizeButtonServiceActions } from '@tfx-diagram/diagram-data-access-store-actions';
import { FontSizeDialogComponent } from './font-size-dialog/font-size-dialog.component';
import { FontSizeDialogData } from './font-size-dialog/font-size-dialog.types';

@Injectable({ providedIn: 'root' })
export class FontSizeButtonService {
  constructor(private dialog: MatDialog, private store: Store) {}

  openFontSizeDialog(el: HTMLElement, fontSizePt: number) {
    let config: MatDialogConfig<FontSizeDialogData> = {
      data: { fontSizePt },
      width: '175px',
      height: '585px',
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
    this.store.dispatch(FontSizeButtonServiceActions.fontSizeDialogOpening());
    const dialogRef: MatDialogRef<FontSizeDialogComponent, number> = this.dialog.open(
      FontSizeDialogComponent,
      config
    );
    dialogRef.afterClosed().subscribe((selectedFontSize) => {
      this.store.dispatch(FontSizeButtonServiceActions.fontSizeDialogClosed());
      if (selectedFontSize) {
        this.store.dispatch(
          FontSizeButtonServiceActions.fontPropsChange({
            props: { fontSizePt: selectedFontSize },
          })
        );
      }
    });
  }
}
