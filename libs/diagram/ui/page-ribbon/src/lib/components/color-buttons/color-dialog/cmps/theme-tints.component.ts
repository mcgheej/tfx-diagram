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
  selector: 'tfx-theme-tints',
  template: `
    <div class="tints">
      <tfx-color-squares-row
        *ngFor="let row of tints; let isFirst = first; let isLast = last"
        [colors]="row"
        [highlightedColor]="highlightedColor"
        [selectedColorRef]="selectedColorRef"
        [showTopBorder]="isFirst"
        [showBottomBorder]="isLast"
        (highlightedColorChange)="onHighlightedColorChange($event)"
        (colorSelect)="onClick($event)"
      ></tfx-color-squares-row>
    </div>
  `,
  styles: [
    `
      .tints {
        margin-top: 13px;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemeTintsComponent implements OnInit {
  @Input() themeColors!: ColorTheme;
  @Input() selectedColorRef!: ColorRef;
  @Input() highlightedColor: ColorRef | null = null;
  @Output() highlightedColorChange = new EventEmitter<ColorRef | null>();
  @Output() colorSelect = new EventEmitter<ColorRef>();

  tints: ColorRow[] = [];

  ngOnInit(): void {
    this.tints = [];
    const colorTheme = this.themeColors;
    for (let i = 1; i < colorTheme.accent1.length; i++) {
      this.tints.push(themeRow(i, colorTheme));
    }
  }

  onHighlightedColorChange(colorRef: ColorRef | null) {
    this.highlightedColorChange.emit(colorRef);
  }

  onClick(colorRef: ColorRef) {
    this.colorSelect.emit(colorRef);
  }
}
