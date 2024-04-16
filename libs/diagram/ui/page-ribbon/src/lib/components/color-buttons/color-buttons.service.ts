import { Injectable } from '@angular/core';
import { MatLegacyDialog as MatDialog, MatLegacyDialogConfig as MatDialogConfig, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { Store } from '@ngrx/store';
import { ColorButtonsServiceActions } from '@tfx-diagram/diagram-data-access-store-actions';
import { ColorRef } from '@tfx-diagram/electron-renderer-web/shared-types';
import { ColorDialogComponent } from './color-dialog/color-dialog.component';
import { ColorDialogData, ColorDialogTypes } from './color-dialog/color-dialog.types';

@Injectable({ providedIn: 'root' })
export class ColorButtonsService {
  constructor(private dialog: MatDialog, private store: Store) {}

  openColorDialog(
    dialogType: ColorDialogTypes,
    el: HTMLElement,
    selectedColors: { lineColor?: ColorRef; fillColor?: ColorRef; textColor?: ColorRef }
  ) {
    let config: MatDialogConfig<ColorDialogData> = {
      data: {
        dialogType,
        selectedColors,
        store: this.store,
      },
      width: '234px',
      height: '450px',
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
    this.store.dispatch(ColorButtonsServiceActions.colorDialogOpening());
    const dialogRef: MatDialogRef<ColorDialogComponent, ColorRef> = this.dialog.open(
      ColorDialogComponent,
      config
    );
    dialogRef.afterClosed().subscribe((selectedColor) => {
      this.store.dispatch(ColorButtonsServiceActions.colorDialogClosed());
      if (selectedColor) {
        if (dialogType === 'Fill Color') {
          this.store.dispatch(
            ColorButtonsServiceActions.fillColorChange({ fillColor: selectedColor })
          );
        } else if (dialogType === 'Line Color') {
          this.store.dispatch(
            ColorButtonsServiceActions.lineColorChange({ lineColor: selectedColor })
          );
        } else {
          this.store.dispatch(
            ColorButtonsServiceActions.fontPropsChange({ props: { color: selectedColor } })
          );
        }
      }
    });
  }
}
