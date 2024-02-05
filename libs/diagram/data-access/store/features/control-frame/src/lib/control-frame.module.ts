import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { ControlFrameEffects } from './control-frame.effects';
import { controlFrameFeature } from './control-frame.feature';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(controlFrameFeature),
    EffectsModule.forFeature([ControlFrameEffects]),
  ],
})
export class ControlFrameModule {}
