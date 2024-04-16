import { Injectable } from '@angular/core';
import { MatLegacyDialog as MatDialog, MatLegacyDialogConfig as MatDialogConfig, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { Color } from '@tfx-diagram/shared-angular/utils/shared-types';
import { Observable, Subject } from 'rxjs';
import { CustomColorDialogComponent } from '../../custom-color-dialog/custom-color-dialog.component';
import { CustomColorDialogData } from '../../custom-color-dialog/custom-color-dialog.types';

@Injectable({ providedIn: 'root' })
export class CustomColorsService {
  constructor(private dialog: MatDialog) {}

  openCustomColorDialog(selectedColor: Color): Observable<Color | undefined> {
    const config: MatDialogConfig<CustomColorDialogData> = {
      data: {
        selectedColor,
      },
      width: '334px',
      height: '550px',
      backdropClass: 'tfx-dialog-backdrop-transparent',
    };
    const result$ = new Subject<Color | undefined>();
    const dialogRef: MatDialogRef<CustomColorDialogComponent, Color> = this.dialog.open(
      CustomColorDialogComponent,
      config
    );
    dialogRef.afterClosed().subscribe((selectedColor) => {
      if (selectedColor) {
        result$.next(selectedColor);
      } else {
        result$.next(undefined);
      }
      result$.complete();
    });
    return result$.asObservable();
  }
}
