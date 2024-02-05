import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { SketchbookEffects } from './sketchbook.effects';
import { sketchbookFeature } from './sketchbook.feature';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(sketchbookFeature),
    EffectsModule.forFeature([SketchbookEffects]),
  ],
})
export class SketchbookModule {}
