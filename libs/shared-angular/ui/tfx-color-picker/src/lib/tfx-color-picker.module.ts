import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TfxResizeObserverModule } from '@tfx-diagram/shared-angular/ui/tfx-resize-observer';
import { ColorPickerComponent } from './color-picker/color-picker.component';
import { HueSatDiscComponent } from './components/hue-sat-disc/hue-sat-disc.component';
import { LightnessSliderComponent } from './components/lightness-slider/lightness-slider.component';
import { SaturationSliderComponent } from './components/saturation-slider/saturation-slider.component';

@NgModule({
  imports: [CommonModule, TfxResizeObserverModule],
  declarations: [
    ColorPickerComponent,
    LightnessSliderComponent,
    HueSatDiscComponent,
    SaturationSliderComponent,
  ],
  exports: [ColorPickerComponent],
})
export class TfxColorPickerModule {}
