import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { ColorRef, ColorTheme } from '@tfx-diagram/electron-renderer-web/shared-types';
import { ColorRow, themeRow } from '../color-dialog.types';

@Component({
  selector: 'tfx-theme-colors',
  template: `
    <div class="title">Theme Colours</div>
    <tfx-color-squares-row
      [colors]="mainThemeColors"
      [highlightedColor]="highlightedColor"
      [selectedColorRef]="selectedColorRef"
      (highlightedColorChange)="onHighlightedColorChange($event)"
      (colorSelect)="onClick($event)"
    ></tfx-color-squares-row>
    <tfx-theme-tints
      [themeColors]="themeColors"
      [selectedColorRef]="selectedColorRef"
      [highlightedColor]="highlightedColor"
      (highlightedColorChange)="onHighlightedColorChange($event)"
      (colorSelect)="onClick($event)"
    ></tfx-theme-tints>
  `,
  styles: [
    `
           .title {
             margin: 3px 0 10px 0;
             font-size: 10pt;
             font-weight: 500;
           }
         `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemeColorsComponent implements OnInit {
  @Input() themeColors!: ColorTheme;
  @Input() selectedColorRef!: ColorRef;
  @Input() highlightedColor: ColorRef | null = null;
  @Output() highlightedColorChange = new EventEmitter<ColorRef | null>();
  @Output() colorSelect = new EventEmitter<ColorRef>();

  mainThemeColors: ColorRow = [];

  ngOnInit(): void {
    this.mainThemeColors = themeRow(0, this.themeColors);
  }

  onHighlightedColorChange(colorRef: ColorRef | null) {
    this.highlightedColorChange.emit(colorRef);
  }

  onClick(colorRef: ColorRef) {
    this.colorSelect.emit(colorRef);
  }
}
