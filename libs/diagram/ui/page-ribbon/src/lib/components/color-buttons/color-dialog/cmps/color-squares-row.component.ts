import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { ColorRef } from '@tfx-diagram/electron-renderer-web/shared-types';
import { ColorSquare } from '../color-dialog.types';

@Component({
  selector: 'tfx-color-squares-row',
  template: `
    <div [ngStyle]="gridContainer">
      <tfx-color-square
        *ngFor="let colorSquare of colors"
        [color]="colorSquare.color.rgb.hex"
        [showTopBorder]="showTopBorder"
        [showBottomBorder]="showBottomBorder"
        [highlighted]="
          (highlightedColor && highlightedColor.ref === colorSquare.ref.ref) ||
          selectedColorRef.ref === colorSquare.ref.ref
        "
        (mouseenter)="onMouseEnter(colorSquare.ref)"
        (mouseleave)="onMouseLeave()"
        (click)="onClick(colorSquare.ref)"
      ></tfx-color-square>
    </div>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColorSquaresRowComponent implements OnInit {
  @Input() colors: ColorSquare[] = [];
  @Input() highlightedColor: ColorRef | null = null;
  @Input() selectedColorRef!: ColorRef;
  @Input() squaresPerRow = 10;
  @Input() squareSizePx = 15;
  @Input() gapPx = 4;
  @Input() showTopBorder = true;
  @Input() showBottomBorder = true;
  @Output() highlightedColorChange = new EventEmitter<ColorRef | null>();
  @Output() colorSelect = new EventEmitter<ColorRef>();

  gridContainer!: { [klass: string]: number | string };

  ngOnInit(): void {
    this.gridContainer = {
      display: 'grid',
      gridTemplateColumns: `repeat(${this.squaresPerRow}, ${this.squareSizePx}px)`,
      gridTemplateRows: `${this.squareSizePx}px`,
      gridAutoRows: `${this.squareSizePx}px`,
      columnGap: `${this.gapPx}px`,
      rowGap: `${this.gapPx}px`,
    };
  }

  onMouseEnter(colorRef: ColorRef) {
    this.highlightedColorChange.emit(colorRef);
  }

  onMouseLeave() {
    this.highlightedColorChange.emit(null);
  }

  onClick(colorRef: ColorRef) {
    this.colorSelect.emit(colorRef);
  }
}
