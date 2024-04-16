import { Injectable } from '@angular/core';
import { MatLegacyDialog as MatDialog, MatLegacyDialogConfig as MatDialogConfig, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { Store } from '@ngrx/store';
import { FontFamilyButtonServiceActions } from '@tfx-diagram/diagram-data-access-store-actions';
import { FontFamilyDialogComponent } from './font-family-dialog/font-family-dialog.component';
import { FontFamilyDialogData } from './font-family-dialog/font-family-dialog.types';

@Injectable({ providedIn: 'root' })
export class FontFamilyButtonService {
  constructor(private dialog: MatDialog, private store: Store) {}

  openFontFamilyDialog(el: HTMLElement, fontFamily: string) {
    let config: MatDialogConfig<FontFamilyDialogData> = {
      data: { fontFamily },
      width: '275px',
      height: '250px',
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
    this.store.dispatch(FontFamilyButtonServiceActions.fontFamilyDialogOpening());
    const dialogRef: MatDialogRef<FontFamilyDialogComponent, string> = this.dialog.open(
      FontFamilyDialogComponent,
      config
    );
    dialogRef.afterClosed().subscribe((selectedFontFamily) => {
      this.store.dispatch(FontFamilyButtonServiceActions.FontFamilyDialogClosed());
      if (selectedFontFamily) {
        this.store.dispatch(
          FontFamilyButtonServiceActions.fontPropsChange({
            props: { fontFamily: selectedFontFamily },
          })
        );
      }
    });
  }
}
