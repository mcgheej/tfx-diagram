import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PRESET_LINE_DASH_VALUES, Size } from '@tfx-diagram/electron-renderer-web/shared-types';
import { LineDashDialogData } from './line-dash-dialog.types';

@Component({
  templateUrl: './line-dash-dialog.component.html',
  styleUrls: ['./line-dash-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LineDashDialogComponent implements OnInit {
  gridTemplateRows = 'repeat(1, 1fr)';

  readonly presetLineDashValues = new Array<number[]>(PRESET_LINE_DASH_VALUES.length);

  constructor(
    private changeDetect: ChangeDetectorRef,
    private dialogRef: MatDialogRef<LineDashDialogComponent, number[]>,
    @Inject(MAT_DIALOG_DATA) public data: LineDashDialogData
  ) {}

  ngOnInit(): void {
    const numberOfRows = Math.floor((PRESET_LINE_DASH_VALUES.length + 1) / 2);
    this.gridTemplateRows = `repeat(${numberOfRows}, 1fr)`;
    let k = 0;
    for (let j = 0; j < 2; j++) {
      for (let i = 0; i < numberOfRows; i++) {
        if (k < PRESET_LINE_DASH_VALUES.length) {
          this.presetLineDashValues[i * 2 + j] = PRESET_LINE_DASH_VALUES[k++];
        }
      }
    }
  }

  onCanvasSize(size: Size, el: HTMLCanvasElement) {
    el.width = size.width;
    el.height = size.height;
    this.changeDetect.detectChanges();
  }

  onLineDashClick(lineDash: number[]) {
    this.dialogRef.close(lineDash);
  }

  isMatch(a: number[], b: number[]): boolean {
    if (a.length !== b.length) {
      return false;
    }
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) {
        return false;
      }
    }
    return true;
  }
}
