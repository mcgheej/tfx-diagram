import { Injectable } from '@angular/core';
import { MatLegacyDialog as MatDialog, MatLegacyDialogConfig as MatDialogConfig, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { Store } from '@ngrx/store';
import { TextOptionsServiceActions } from '@tfx-diagram/diagram-data-access-store-actions';
import { FontProps } from '@tfx-diagram/electron-renderer-web/shared-types';
import { BehaviorSubject } from 'rxjs';
import { TextOptionsDialogComponent } from './text-options-dialog/text-options-dialog.component';
import { TextOptionsDialogDataProps } from './text-options-dialog/text-options-dialog.types';

@Injectable({ providedIn: 'root' })
export class TextOptionsService {
  private dialogOpenSubject$ = new BehaviorSubject<boolean>(false);
  dialogOpen$ = this.dialogOpenSubject$.asObservable();

  constructor(private dialog: MatDialog, private store: Store) {}

  openTextOptionsDialog(el: HTMLElement, textOptions: TextOptionsDialogDataProps) {
    let config: MatDialogConfig<TextOptionsDialogDataProps> = {
      data: textOptions,
      width: '320px',
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
      this.store.dispatch(TextOptionsServiceActions.textOptionsDialogOpening());
      const dialogRef: MatDialogRef<
        TextOptionsDialogComponent,
        Partial<FontProps>
      > = this.dialog.open(TextOptionsDialogComponent, config);
      this.dialogOpenSubject$.next(true);
      dialogRef.afterClosed().subscribe((textOptions) => {
        this.dialogOpenSubject$.next(false);
        this.store.dispatch(TextOptionsServiceActions.textOptionsDialogClosed());
        if (textOptions) {
          this.store.dispatch(
            TextOptionsServiceActions.fontPropsChange({
              props: textOptions,
            })
          );
        }
      });
    }
  }
}
