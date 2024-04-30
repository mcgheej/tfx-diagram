import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatRadioChange } from '@angular/material/radio';
import { MatSelectChange } from '@angular/material/select';
import {
  PageFormats,
  PageLayout,
  pageFormats,
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
  width = 297;
  height = 210;
  layout = 'Landscape';

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
      layout: [this.layout],
    });
    this.pageFormats = [...pageFormats];
  }

  create() {
    this.dialogRef.close({
      title: this.form.get('title')?.value as string,
      pageFormat: this.form.get('pageFormat')?.value as PageFormats,
      width: this.width,
      height: this.height,
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
      this.width = pageSizesMM[pageFormat].width;
      this.height = pageSizesMM[pageFormat].height;
    } else {
      this.width = pageSizesMM[pageFormat].height;
      this.height = pageSizesMM[pageFormat].width;
    }
  }
}
