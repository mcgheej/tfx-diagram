import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { ColorMapRef } from '@tfx-diagram/diagram/data-access/color-classes';
import { ColorRef } from '@tfx-diagram/electron-renderer-web/shared-types';
import { IconButtonOptions } from '@tfx-diagram/shared-angular/ui/tfx-icon-button';
import { Color } from '@tfx-diagram/shared-angular/utils/shared-types';
import { ColorRow, customSquareFromColor } from '../color-dialog.types';
import { CustomColorsService } from './custom-colors.service';

@Component({
  selector: 'tfx-custom-colors',
  template: `
    <div class="title">Custom Colours</div>
    <div class="custom-colors-container">
      <tfx-icon-button
        class="center-center"
        [config]="addButtonConfig"
        [style.color]="'#2A2B2D'"
        matTooltip="Add Custom Colour"
        matTooltipShowDelay="2000"
        (buttonClick)="onAddClick()"
      ></tfx-icon-button>
      <tfx-color-squares-row
        [colors]="customColorSquares"
        [highlightedColor]="highlightedColor"
        [selectedColorRef]="selectedColorRef"
        [squaresPerRow]="8"
        (highlightedColorChange)="onHighlightedColorChange($event)"
        (colorSelect)="onClick($event)"
      ></tfx-color-squares-row>
    </div>
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

      .custom-colors-container {
        display: grid;
        grid-template-columns: 24px 1fr;
        grid-template-rows: 34px;
        column-gap: 14px;
      }

      .center-center {
        justify-self: center;
        align-self: center;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomColorsComponent implements OnInit, OnChanges {
  @Input() customColors!: Map<string, Color>;
  @Input() selectedColorRef!: ColorRef;
  @Input() highlightedColor: ColorRef | null = null;
  @Output() highlightedColorChange = new EventEmitter<ColorRef | null>();
  @Output() colorSelect = new EventEmitter<ColorRef>();
  @Output() colorAdd = new EventEmitter<Color>();

  customColorSquares: ColorRow = [];
  addButtonConfig!: Partial<IconButtonOptions>;

  constructor(private customColorService: CustomColorsService) {}

  ngOnInit(): void {
    this.buildColorSquares();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['customColors'] && !changes['customColors'].firstChange) {
      this.buildColorSquares();
    }
  }

  onHighlightedColorChange(colorRef: ColorRef | null) {
    this.highlightedColorChange.emit(colorRef);
  }

  onClick(colorRef: ColorRef) {
    this.colorSelect.emit(colorRef);
  }

  onAddClick() {
    const selectedColor =
      this.selectedColorRef.colorSet === 'empty'
        ? ColorMapRef.resolveColor({ colorSet: 'theme', ref: 'text1-0' })
        : ColorMapRef.resolveColor(this.selectedColorRef);
    if (selectedColor) {
      this.customColorService.openCustomColorDialog(selectedColor).subscribe((result) => {
        if (result) {
          this.colorAdd.emit(result);
        }
      });
    }
  }

  private buildColorSquares() {
    const customColors = this.customColors;
    this.customColorSquares = [];
    customColors.forEach((value, id) => {
      this.customColorSquares.push(customSquareFromColor(id, value));
    });
    this.addButtonConfig = {
      iconName: 'control_point',
      disabled: this.customColorSquares.length > 15,
    };
  }
}
