import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { getHexRGB } from '@tfx-diagram/diagram/util/misc-functions';
import {
  Color,
  ColorHSL,
  ColorRGB,
  hsl2rgb,
  rgb2hsl,
} from '@tfx-diagram/shared-angular/utils/shared-types';
import { CustomColorDialogData } from './custom-color-dialog.types';

@Component({
  templateUrl: './custom-color-dialog.component.html',
  styleUrls: ['./custom-color-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomColorDialogComponent implements OnInit {
  constructor(
    private dialogRef: MatDialogRef<CustomColorDialogComponent, Color>,
    @Inject(MAT_DIALOG_DATA) public data: CustomColorDialogData
  ) {}

  color!: Color;
  rgb!: ColorRGB;
  hsl!: ColorHSL;
  colorStyle = '';

  ngOnInit(): void {
    this.rgb = this.copyRGB(this.data.selectedColor.rgb);
    this.hsl = this.copyHSL(this.data.selectedColor.hsl);
    this.setColor(this.rgb, this.hsl);
  }

  onRGBChange(red: number, green: number, blue: number) {
    this.rgb = { red, green, blue, hex: getHexRGB(red, green, blue) };
    this.hsl = rgb2hsl(this.rgb.red, this.rgb.green, this.rgb.blue);
    this.setColor(this.rgb, this.hsl);
  }

  onHSLChange(h: number, s: number, l: number) {
    this.rgb = this.copyRGB(hsl2rgb(h, s, l));
    this.hsl = rgb2hsl(this.rgb.red, this.rgb.green, this.rgb.blue);
    this.setColor(this.rgb, this.hsl);
  }

  onColorChange(color: Color) {
    this.rgb = this.copyRGB(color.rgb);
    this.hsl = this.copyHSL(rgb2hsl(this.rgb.red, this.rgb.green, this.rgb.blue));
    this.setColor(this.rgb, this.hsl);
  }

  onColorSelect() {
    this.dialogRef.close(this.color);
  }

  copyRGB(rgb: ColorRGB): ColorRGB {
    return {
      red: Math.round(rgb.red),
      green: Math.round(rgb.green),
      blue: Math.round(rgb.blue),
      hex: rgb.hex,
    };
  }

  copyHSL(hsl: ColorHSL): ColorHSL {
    return {
      hue: hsl.hue,
      saturation: hsl.saturation,
      lightness: hsl.lightness,
    };
  }

  private setColor(rgb: ColorRGB, hsl: ColorHSL) {
    this.color = { description: '', rgb: this.copyRGB(rgb), hsl: this.copyHSL(hsl) };
    this.colorStyle = `rgb(${rgb.red}, ${rgb.green}, ${rgb.blue})`;
  }
}
