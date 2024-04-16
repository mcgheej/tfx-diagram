import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { MatLegacySelectionListChange as MatSelectionListChange } from '@angular/material/legacy-list';
import { PRESET_FONT_FAMILIES } from '@tfx-diagram/electron-renderer-web/shared-types';
import { FontFamilyDialogData } from './font-family-dialog.types';

@Component({
  templateUrl: './font-family-dialog.component.html',
  styleUrls: ['./font-family-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FontFamilyDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<FontFamilyDialogComponent, number>,
    @Inject(MAT_DIALOG_DATA) public data: FontFamilyDialogData
  ) {}

  PRESET_FONT_FAMILIES = PRESET_FONT_FAMILIES;

  onSelectionChange(change: MatSelectionListChange) {
    if (change.options.length > 0) {
      this.dialogRef.close(change.options[0].value);
    }
  }
}
