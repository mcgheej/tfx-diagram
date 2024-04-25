import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { ColorRef } from '@tfx-diagram/electron-renderer-web/shared-types';
import { Color } from '@tfx-diagram/shared-angular/utils/shared-types';
import { ColorRow, standardSquareFromColor } from '../color-dialog.types';

@Component({
  selector: 'tfx-standard-colors',
  template: `
    <div class="title">Standard Colours</div>
    <tfx-color-squares-row
      [colors]="standardColorSquares"
      [highlightedColor]="highlightedColor"
      [selectedColorRef]="selectedColorRef"
      (highlightedColorChange)="onHighlightedColorChange($event)"
      (colorSelect)="onClick($event)"
    ></tfx-color-squares-row>
  `,
  styles: [
    `
           .title {
             margin: 10px 0 10px 0;
             width: 100%;
             border-top: 1px solid #e2e4e7;
             font-size: 10pt;
             font-weight: 500;
             padding: 8px 0 0px 0;
           }
         `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StandardColorsComponent implements OnInit {
  @Input() standardColors!: Color[];
  @Input() selectedColorRef!: ColorRef;
  @Input() highlightedColor: ColorRef | null = null;
  @Output() highlightedColorChange = new EventEmitter<ColorRef | null>();
  @Output() colorSelect = new EventEmitter<ColorRef>();

  standardColorSquares: ColorRow = [];

  ngOnInit(): void {
    const standardColors = this.standardColors;
    for (let i = 0; i < standardColors.length; i++) {
      this.standardColorSquares.push(standardSquareFromColor(i, standardColors[i]));
    }
  }

  onHighlightedColorChange(colorRef: ColorRef | null) {
    this.highlightedColorChange.emit(colorRef);
  }

  onClick(colorRef: ColorRef) {
    this.colorSelect.emit(colorRef);
  }
}
