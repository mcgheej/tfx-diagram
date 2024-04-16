import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { MatLegacySelectionListChange as MatSelectionListChange } from '@angular/material/legacy-list';
import { PRESET_FONT_SIZES_PT } from '@tfx-diagram/electron-renderer-web/shared-types';
import { FontSizeDialogData } from './font-size-dialog.types';

@Component({
  templateUrl: './font-size-dialog.component.html',
  styleUrls: ['./font-size-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FontSizeDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<FontSizeDialogComponent, number>,
    @Inject(MAT_DIALOG_DATA) public data: FontSizeDialogData
  ) {}

  PRESET_FONT_SIZES_PT = PRESET_FONT_SIZES_PT;

  onSelectionChange(change: MatSelectionListChange) {
    if (change.options.length > 0) {
      this.dialogRef.close(change.options[0].value);
    }
  }
}
