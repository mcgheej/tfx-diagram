import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { MatLegacyRadioChange as MatRadioChange } from '@angular/material/legacy-radio';
import { MatLegacySelectChange as MatSelectChange } from '@angular/material/legacy-select';
import {
  PageFormats,
  pageFormats,
  PageLayout,
  pageSizesMM,
} from '@tfx-diagram/electron-renderer-web/shared-types';

export interface NewDialogData {
  dialogType: 'Sketchbook' | 'Page';
}

export interface NewDialogResult {
  title: string;
  pageFormat: PageFormats;
  width: number;
  height: number;
  layout: PageLayout;
}

@Component({
  selector: 'tfx-new-dialog',
  templateUrl: './new-dialog.component.html',
  styleUrls: ['./new-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewDialogComponent implements OnInit {
  form!: UntypedFormGroup;
  pageFormats: string[] = [];
  dialogTitle = 'New Sketchbook';

  constructor(
    private fb: UntypedFormBuilder,
    private dialogRef: MatDialogRef<NewDialogComponent, NewDialogResult>,
    @Inject(MAT_DIALOG_DATA) public data: NewDialogData
  ) {}

  ngOnInit(): void {
    if (this.data.dialogType === 'Page') {
      this.dialogTitle = 'Add Page';
    }
    this.form = this.fb.group({
      title: [this.data.dialogType === 'Sketchbook' ? '' : 'Unknown', Validators.required],
      pageFormat: ['A4', Validators.required],
      width: ['210', Validators.required],
      height: ['297', Validators.required],
      layout: ['Portrait'],
    });
    this.pageFormats = [...pageFormats];
  }

  create() {
    // this.dialogRef.close(this.form.value);
    this.dialogRef.close({
      title: this.form.get('title')?.value as string,
      pageFormat: this.form.get('pageFormat')?.value as PageFormats,
      width: +this.form.get('width')?.value as number,
      height: +this.form.get('height')?.value as number,
      layout: this.form.get('layout')?.value as PageLayout,
    } as NewDialogResult);
  }

  close() {
    this.dialogRef.close();
  }

  onPageFormatChange(change: MatSelectChange) {
    const layout = this.form.get('layout')?.value;
    if (layout) {
      this.updateSize(change.value, layout);
    }
  }

  onLayoutChange(change: MatRadioChange) {
    this.form.get('layout')?.setValue(change.value);
    const pageFormat = this.form.get('pageFormat')?.value;
    if (pageFormat) {
      this.updateSize(pageFormat, change.value);
    }
  }

  private updateSize(pageFormat: PageFormats, layout: PageLayout) {
    if (layout === 'Portrait') {
      this.form.get('width')?.setValue(pageSizesMM[pageFormat].width);
      this.form.get('height')?.setValue(pageSizesMM[pageFormat].height);
    } else {
      this.form.get('width')?.setValue(pageSizesMM[pageFormat].height);
      this.form.get('height')?.setValue(pageSizesMM[pageFormat].width);
    }
  }
}
