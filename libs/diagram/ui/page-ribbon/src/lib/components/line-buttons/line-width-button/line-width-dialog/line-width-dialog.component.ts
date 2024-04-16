import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { PRESET_LINE_WIDTHS } from '@tfx-diagram/electron-renderer-web/shared-types';
import { Size } from 'electron';
import { LineWidthDialogData } from './line-width-dialog.types';

@Component({
  templateUrl: './line-width-dialog.component.html',
  styleUrls: ['./line-width-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LineWidthDialogComponent implements OnInit {
  gridTemplateRows = 'repeat(1, 1fr)';

  readonly presetLineWidths = new Array<number>(PRESET_LINE_WIDTHS.length);

  constructor(
    private changeDetect: ChangeDetectorRef,
    private dialogRef: MatDialogRef<LineWidthDialogComponent, number>,
    @Inject(MAT_DIALOG_DATA) public data: LineWidthDialogData
  ) {}

  ngOnInit(): void {
    const numberOfRows = Math.floor((PRESET_LINE_WIDTHS.length + 1) / 2);
    this.gridTemplateRows = `repeat(${numberOfRows}, 1fr)`;
    let k = 0;
    for (let j = 0; j < 2; j++) {
      for (let i = 0; i < numberOfRows; i++) {
        if (k < PRESET_LINE_WIDTHS.length) {
          this.presetLineWidths[i * 2 + j] = PRESET_LINE_WIDTHS[k++];
        }
      }
    }
  }

  onCanvasSize(size: Size, el: HTMLCanvasElement) {
    console.log(el);
    el.width = size.width;
    el.height = size.height;
    this.changeDetect.detectChanges();
  }

  onWidthClick(lineWidth: number) {
    this.dialogRef.close(lineWidth);
  }
}
