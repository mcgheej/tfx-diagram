import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { Color, ColorHSL } from '@tfx-diagram/shared-angular/utils/shared-types';
import { hsl2rgb, rgb2hsl } from '../misc-functions';

@Component({
  selector: 'tfx-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColorPickerComponent implements OnInit {
  @Input() hue = 297.9;
  @Input() saturation = 0.737;
  @Input() lightness = 0.5;
  @Input() discSizePx = 257;
  @Input() sliderSizePx = 32;
  @Input() showSaturationSlider = false;
  @Output() colorChange = new EventEmitter<Color>();
  // @Output() colorSelected = new EventEmitter<Color>();

  containerStyles!: { [klass: string]: string | number };

  ngOnInit(): void {
    this.containerStyles = {
      display: 'grid',
      gridTemplateColumns: `${this.discSizePx}px ${this.sliderSizePx}px`,
      gridTemplateRows: this.showSaturationSlider
        ? `${this.discSizePx}px ${this.sliderSizePx}px`
        : `${this.discSizePx}px`,
    };
  }

  onLightnessChanged(newLightness: number) {
    this.lightness = newLightness;
    this.colorChange.emit(this.getColor());
  }

  onValuesChanged(newValues: ColorHSL) {
    this.hue = newValues.hue;
    this.saturation = newValues.saturation;
    this.colorChange.emit(this.getColor());
  }

  onSaturationChanged(newSaturation: number) {
    this.saturation = newSaturation;
    this.colorChange.emit(this.getColor());
  }

  private getColor(): Color {
    const rgb = hsl2rgb(this.hue, this.saturation, this.lightness);
    const hsl = rgb2hsl(rgb.red, rgb.green, rgb.blue);
    return { description: '', hsl, rgb };
  }
}
