import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { ColorsEffects } from './colors.effects';
import { colorsFeature } from './colors.feature';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(colorsFeature),
    EffectsModule.forFeature([ColorsEffects]),
  ],
})
export class ColorsModule {}
